from django.conf import settings
from django.db import models


class Itinerary(models.Model):
    """Saved itinerary — belongs to a user."""

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
