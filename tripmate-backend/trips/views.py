from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Itinerary, TripGeneration
from .serializers import (
    ItinerarySerializer,
    TripCreateSerializer,
    TripCustomizeSerializer,
    UserSerializer,
)
from .services.openai_service import customize_itinerary, generate_itinerary
from .services.places_service import search_places

User = get_user_model()


# ----- Auth -----

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """POST /api/auth/register/ — create user. Body: username, password, email (optional)."""
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email", "")
    if not username or not password:
        return Response(
            {"error": "username and password required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "username already taken"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """GET /api/auth/me/ — current logged-in user (requires auth)."""
    return Response(UserSerializer(request.user).data)


# ----- Trips (create, edit, customize) -----

@api_view(["GET"])
@permission_classes([AllowAny])
def trip_list(request):
    """GET /api/trips/ — list trips (for authenticated users)."""
    if request.user.is_authenticated:
        qs = Itinerary.objects.filter(user=request.user)
        from .serializers import ItineraryListSerializer
        return Response({"trips": ItineraryListSerializer(qs, many=True).data})
    return Response({"trips": []})


def _run_trip_generation(trip_id):
    """Background task: run AI and update TripGeneration."""
    from .models import TripGeneration
    try:
        trip = TripGeneration.objects.get(pk=trip_id)
    except TripGeneration.DoesNotExist:
        return
    try:
        places = search_places(trip.destination, types="attraction")
        plan = generate_itinerary(
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            interests=trip.interests or [],
            places_data=places,
        )
        trip.plan = plan or []
        trip.status = TripGeneration.STATUS_COMPLETED
        trip.save(update_fields=["plan", "status", "updated_at"])
        print("[TripMate] Trip generation completed:", trip.uuid)
    except Exception as e:
        trip.status = TripGeneration.STATUS_FAILED
        trip.error_message = str(e)[:500]
        trip.save(update_fields=["status", "error_message", "updated_at"])
        print("[TripMate] Trip generation failed:", trip.uuid, e)


@api_view(["POST"])
@permission_classes([AllowAny])
def trip_create(request):
    """POST /api/trips/create/ — create trip record and return uuid; AI runs in background."""
    serializer = TripCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    destination = data["destination"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    interests = data.get("interests", []) or []

    trip = TripGeneration.objects.create(
        destination=destination,
        start_date=start_date,
        end_date=end_date,
        interests=interests,
        status=TripGeneration.STATUS_PENDING,
    )
    import threading
    thread = threading.Thread(target=_run_trip_generation, args=(trip.pk,))
    thread.daemon = True
    thread.start()
    print("[TripMate] Created trip", trip.uuid, "— generation started in background")

    return Response({
        "uuid": str(trip.uuid),
        "destination": destination,
        "start_date": str(start_date),
        "end_date": str(end_date),
        "interests": interests,
        "status": TripGeneration.STATUS_PENDING,
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])
def trip_get(request, uuid):
    """GET /api/trips/<uuid>/ — get trip by uuid (for polling). If user is logged in and trip completed, auto-save to their profile."""
    try:
        trip = TripGeneration.objects.get(uuid=uuid)
    except TripGeneration.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    payload = {
        "uuid": str(trip.uuid),
        "destination": trip.destination,
        "start_date": str(trip.start_date),
        "end_date": str(trip.end_date),
        "interests": trip.interests or [],
        "status": trip.status,
    }
    if trip.status == TripGeneration.STATUS_COMPLETED:
        payload["plan"] = trip.plan or []
        payload["flights"] = []
        payload["hotels"] = []
        # If user is logged in, create an Itinerary on their profile (once per user per generation)
        if request.user.is_authenticated:
            if not Itinerary.objects.filter(user=request.user, trip_generation=trip).exists():
                Itinerary.objects.create(
                    user=request.user,
                    trip_generation=trip,
                    title=f"{trip.destination} Trip",
                    destination=trip.destination,
                    start_date=trip.start_date,
                    end_date=trip.end_date,
                    interests=trip.interests or [],
                    plan=trip.plan or [],
                )
    elif trip.status == TripGeneration.STATUS_FAILED:
        payload["error_message"] = trip.error_message or "Generation failed"
    return Response(payload)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def trip_edit(request, pk):
    """PATCH /api/trips/<id>/edit/ — update saved trip (alias for itinerary PATCH)."""
    try:
        obj = Itinerary.objects.get(pk=pk, user=request.user)
    except Itinerary.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    ser = ItinerarySerializer(obj, data=request.data, partial=True)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data)


def _do_customize(plan, data):
    return customize_itinerary(
        plan=plan or [],
        action=data["action"],
        day_index=data["day_index"],
        activity_index=data.get("activity_index"),
        activity_type=data.get("activity_type", "attraction"),
        activity_time=data.get("activity_time") or None,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def trip_customize_anon(request):
    """POST /api/trips/customize/ — customize plan (no auth, for unsaved trips). Body: plan, action, day_index, ..."""
    plan = request.data.get("plan", [])
    ser = TripCustomizeSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    new_plan = _do_customize(plan, ser.validated_data)
    return Response({"plan": new_plan})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def trip_customize_by_id(request, pk):
    """POST /api/trips/<id>/customize/ — add/replace/remove activity on saved trip via AI."""
    try:
        obj = Itinerary.objects.get(pk=pk, user=request.user)
    except Itinerary.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    ser = TripCustomizeSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    new_plan = _do_customize(obj.plan, ser.validated_data)
    obj.plan = new_plan
    obj.save()

    return Response(ItinerarySerializer(obj).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def places_search(request):
    """GET /api/places/search/?q=...&location=... — search attractions."""
    q = request.query_params.get("q", "").strip()
    location = request.query_params.get("location", "")
    if not q:
        return Response({"results": []})
    results = search_places(q, location=location or None)
    return Response({"results": results})


# ----- Itineraries (save / list / update / delete) -----

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def itinerary_list(request):
    """GET /api/itineraries/ — list my itineraries. POST — create (save) one."""
    if request.method == "GET":
        qs = Itinerary.objects.filter(user=request.user)
        serializer = ItinerarySerializer(qs, many=True)
        return Response(serializer.data)
    # POST
    serializer = ItinerarySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(user=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def itinerary_detail(request, uuid):
    """GET/PUT/PATCH/DELETE /api/itineraries/<uuid>/ — one itinerary (only owner)."""
    try:
        obj = Itinerary.objects.get(uuid=uuid, user=request.user)
    except Itinerary.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ItinerarySerializer(obj)
        return Response(serializer.data)
    if request.method == "DELETE":
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # PUT (full) or PATCH (partial)
    serializer = ItinerarySerializer(
        obj, data=request.data, partial=(request.method == "PATCH")
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
