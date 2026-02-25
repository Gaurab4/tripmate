import uuid
from django.conf import settings
from django.db import models


class TripGeneration(models.Model):
    """Anonymous trip generation request — created immediately, AI runs in background."""
    STATUS_PENDING = "pending"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"
    STATUS_CHOICES = [
        (STATUS_PENDING, "pending"),
        (STATUS_COMPLETED, "completed"),
        (STATUS_FAILED, "failed"),
    ]

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    destination = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    interests = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    plan = models.JSONField(default=list, blank=True, null=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.destination} ({self.status})"


class Itinerary(models.Model):
    """Saved itinerary — belongs to a user."""

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    trip_generation = models.ForeignKey(
        TripGeneration,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="saved_itineraries",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="itineraries",
    )
    title = models.CharField(max_length=200)
    destination = models.CharField(max_length=200, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    interests = models.JSONField(default=list, blank=True)  # e.g. ["history", "food"]
    notes = models.TextField(blank=True)
    plan = models.JSONField(default=list, blank=True)  # day-wise: [{day, date, activities}]
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "itineraries"

    def __str__(self):
        return self.title
