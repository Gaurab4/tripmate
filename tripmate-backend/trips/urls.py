from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("trips/", views.trip_list),
    path("trips/create/", views.trip_create),
    path("trips/customize/", views.trip_customize_anon),
    path("trips/<int:pk>/edit/", views.trip_edit),
    path("trips/<int:pk>/customize/", views.trip_customize_by_id),
    path("places/search/", views.places_search),
    path("auth/register/", views.register),
    path("auth/login/", obtain_auth_token),
    path("auth/me/", views.current_user),
    path("itineraries/", views.itinerary_list),
    path("itineraries/<int:pk>/", views.itinerary_detail),
]
