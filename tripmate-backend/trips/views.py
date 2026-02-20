from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Itinerary
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


@api_view(["POST"])
@permission_classes([AllowAny])
def trip_create(request):
    """POST /api/trips/create/ — generate itinerary from destination, dates, interests."""
    serializer = TripCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    destination = data["destination"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    interests = data.get("interests", []) or []

    print("[TripMate] Starting search places...")
    places = search_places(destination, types="attraction")
    print("[TripMate] Starting generate itinerary...")
    plan = generate_itinerary(
        destination=destination,
        start_date=start_date,
        end_date=end_date,
        interests=interests,
        places_data=places,
    )

    return Response({
        "destination": destination,
        "start_date": start_date,
        "end_date": end_date,
        "interests": interests,
        "plan": plan,
        "flights": [],
        "hotels": [],
    })


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
def itinerary_detail(request, pk):
    """GET/PUT/PATCH/DELETE /api/itineraries/<id>/ — one itinerary (only owner)."""
    try:
        obj = Itinerary.objects.get(pk=pk, user=request.user)
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
