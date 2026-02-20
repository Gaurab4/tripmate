from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Itinerary

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Read-only user info (no password)."""

    class Meta:
        model = User
        fields = ("id", "username", "email")
        read_only_fields = fields


class ItinerarySerializer(serializers.ModelSerializer):
    """Serializer for create/update/read Itinerary."""

    class Meta:
        model = Itinerary
        fields = (
            "id",
            "title",
            "destination",
            "start_date",
            "end_date",
            "interests",
            "notes",
            "plan",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class ItineraryListSerializer(serializers.ModelSerializer):
    """Shorter list view (optional)."""

    class Meta:
        model = Itinerary
        fields = ("id", "title", "destination", "start_date", "end_date", "interests", "created_at")


class TripCreateSerializer(serializers.Serializer):
    """Input for trip creation."""

    destination = serializers.CharField(max_length=200)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    interests = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        default=list,
    )


class TripCustomizeSerializer(serializers.Serializer):
    """Input for customize (add/replace/remove) action."""

    action = serializers.ChoiceField(choices=["add", "replace", "remove"])
    day_index = serializers.IntegerField(min_value=0)
    activity_index = serializers.IntegerField(min_value=0, required=False)
    activity_type = serializers.CharField(max_length=20, required=False)
    activity_time = serializers.CharField(max_length=10, required=False, allow_blank=True)
    plan = serializers.ListField(required=False)  # For anon customize, pass current plan
