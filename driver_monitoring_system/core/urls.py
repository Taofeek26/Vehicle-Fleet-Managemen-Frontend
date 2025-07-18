from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    SupervisorCreateView,
    DriverListCreateView,
    VehicleListCreateView,
    DriverTripView,
    SupervisorListView,
    LoginView,
    CurrentUserDetailsView,
    DriverDetailView,
    VehicleDetailView,
    TripDetailView,
    VehicleLocationUpdateView,  # Import the new view
)

urlpatterns = [
    # Endpoint to list edit drivers
    path("drivers/<int:pk>/", DriverDetailView.as_view(), name="driver-detail"),

    # Endpoint to register supervisors
    path('register-supervisor/', SupervisorCreateView.as_view(), name='register-supervisor'),

    # Endpoints for managing drivers (list and create)
    path('drivers/', DriverListCreateView.as_view(), name='drivers'),

    # Endpoints for managing vehicles (list and create)
    path('vehicles/', VehicleListCreateView.as_view(), name="vehicles"),

    # Retrieve, update, or delete a specific vehicle
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name="vehicle-detail"),

    # Endpoints for drivers to log trips and supervisors to view trips
    path("driver-trips/", DriverTripView.as_view(), name='driver-trips'),

    path("driver-trips/<int:pk>/", TripDetailView.as_view(), name="trip-detail"),

    # Login View
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Endpoints for managing supervisors (list)
    path("supervisors/", SupervisorListView.as_view(), name="supervisor-list"),

    # Endpoints for managing users
    path("user-details/", CurrentUserDetailsView.as_view(), name="user-details"),

    # Endpoint for updating vehicle location
    path("vehicles/<int:vehicle_id>/update-location/", VehicleLocationUpdateView.as_view(), name="update-location"),
]
