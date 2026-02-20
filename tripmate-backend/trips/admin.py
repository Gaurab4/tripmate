from django.contrib import admin
from .models import Itinerary


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "destination", "start_date", "end_date", "created_at")
    list_filter = ("created_at",)
    search_fields = ("title", "destination", "user__username")
