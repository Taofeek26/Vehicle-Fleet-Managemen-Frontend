from rest_framework import generics, permissions
from .models import CustomUser, Vehicle, Trip
from .serializers import CustomUserSerializer, VehicleSerializer, TripSerializer, CustomUserSerializer1
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils.timezone import now
import logging

logger = logging.getLogger('core')  # Make sure 'your_app_name' is the same as in your logging config


# Supervisor Creation View
class SupervisorCreateView(generics.CreateAPIView):
    """
    Allows creation of a supervisor user.
    """
    queryset = CustomUser.objects.filter(user_type='supervisor')
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]  # Publicly accessible

    def perform_create(self, serializer):
        password = serializer.validated_data['password']
        user = serializer.save(user_type="supervisor")
        user.set_password(password)  # Hash the password
        user.save()


# Driver List and Creation View
class DriverListCreateView(generics.ListCreateAPIView):
    """
    Supervisors can list and create their drivers.
    """
    serializer_class = CustomUserSerializer1
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only drivers belonging to the logged-in supervisor
        return CustomUser.objects.filter(supervisor=self.request.user, user_type='driver')

    def perform_create(self, serializer):
        # Save the logged-in supervisor as the supervisor for the new driver
        serializer.save(supervisor=self.request.user, user_type='driver')


# View to retrieve, update, or delete a specific driver
class DriverDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific driver.
    """
    queryset = CustomUser.objects.filter(user_type="driver")
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        """
        Override PUT to use partial update.
        This allows fields like 'password' and 'user_type' to remain unchanged.
        """
        kwargs['partial'] = True  # Allow partial updates
        return self.update(request, *args, **kwargs)

    def get_queryset(self):
        # Restrict to drivers under the logged-in supervisor
        supervisor = self.request.user
        return CustomUser.objects.filter(supervisor=supervisor, user_type="driver")

# Vehicle List and Creation View
class VehicleListCreateView(generics.ListCreateAPIView):
    """
    Supervisors can list and create their vehicles.
    """
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == "supervisor":
            # Return vehicles belonging to the supervisor
            return Vehicle.objects.filter(supervisor=user)
        elif user.user_type == "driver":
            # Return vehicles belonging to the driver's supervisor
            return Vehicle.objects.filter(supervisor=user.supervisor)
        return Vehicle.objects.none()  # Return empty if user type is not recognized
    

    def perform_create(self, serializer):
        assigned_driver = self.request.data.get('assigned_driver')
        supervisor = self.request.user
        
        if assigned_driver:
            driver = CustomUser.objects.filter(id=assigned_driver, supervisor=supervisor).first()
            if not driver:
                raise ValidationError("Invalid driver ID or driver does not belong to you.")
            serializer.save(supervisor=supervisor, assigned_driver=driver)
        else:
            serializer.save(supervisor=supervisor)

# Vehicle Detail View for Retrieve, Update, and Delete
class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Supervisors can retrieve, update, or delete their vehicles.
    """
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == "supervisor":
            return Vehicle.objects.filter(supervisor=user)
        elif user.user_type == "driver":
            return Vehicle.objects.filter(supervisor=user.supervisor)
        return Vehicle.objects.none()

    def perform_update(self, serializer):
        serializer.save(last_updated=timezone.now())

# Vehicle Location View for Retrieve, Update, and Delete
class VehicleLocationUpdateView(APIView):
    """
    Endpoint for automatic location updates for a vehicle.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, vehicle_id):
        user = request.user

        if user.user_type != "driver":
            raise ValidationError("Only drivers can update vehicle location.")

        try:
            vehicle = Vehicle.objects.get(id=vehicle_id, assigned_driver=user)
        except Vehicle.DoesNotExist:
            raise ValidationError("Vehicle not found or you are not assigned to this vehicle.")

        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if latitude is None or longitude is None:
            raise ValidationError("Latitude and Longitude are required.")

        vehicle.latitude = latitude
        vehicle.longitude = longitude
        vehicle.last_updated = now()
        vehicle.save()

        return Response({"message": "Location updated successfully."})

# Trip List and Creation View for Drivers
class DriverTripView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        logger.debug(f"User {user.username} is accessing the trips list.")
        if user.user_type == "driver":
            # Drivers can see their own trips
            return Trip.objects.filter(driver=user)
        elif user.user_type == "supervisor":
            # Supervisors can see all trips they created or trips by their drivers
            return Trip.objects.filter(supervisor=user)
        return Trip.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        vehicle_id = self.request.data.get("vehicle_id")
        logger.debug(f"User {user.username} is creating a trip with vehicle_id: {vehicle_id}")
        driver_id = self.request.data.get("driver")
        logger.info(f"Creating trip for user: {user.username}, vehicle_id: {vehicle_id}, driver_id: {driver_id}")
        
        try:
            # Ensure the vehicle exists
            vehicle = Vehicle.objects.get(id=vehicle_id)
            logger.debug(f"Vehicle found: {vehicle.vehicle_name} (ID: {vehicle.id})")

            # Check if the vehicle is already on an ongoing trip
            if Trip.objects.filter(vehicle=vehicle, end_time__isnull=True).exists():
                logger.error(f"Vehicle {vehicle.id} is already on an ongoing trip.")
                raise ValidationError("This vehicle is already on an ongoing trip. Please select another vehicle.")

            # Handle trip creation by a supervisor
            if user.user_type == 'supervisor':
                if not driver_id:
                    logger.error(f"Supervisor {user.username} did not select a driver.")
                    raise ValidationError("A driver must be selected by the supervisor.")
                try:
                    # Ensure the selected driver exists and is supervised by the supervisor
                    driver = CustomUser.objects.get(id=driver_id, user_type='driver', supervisor=user)
                    logger.debug(f"Driver found: {driver.username} (ID: {driver.id})")
                except CustomUser.DoesNotExist:
                    logger.error(f"Driver {driver_id} does not exist or is not supervised by {user.username}.")
                    raise ValidationError("The selected driver does not exist or is not supervised by you.")
                
                serializer.save(supervisor=user, driver=driver, vehicle=vehicle)

            # Handle trip creation by a driver
            elif user.user_type == 'driver':
                if Trip.objects.filter(driver=user, end_time__isnull=True).exists():
                    logger.error(f"Driver {user.username} already has an ongoing trip.")
                    raise ValidationError("You cannot start a new trip until the current trip is ended.")
                
                serializer.save(supervisor=user.supervisor, driver=user, vehicle=vehicle)

            # Handle invalid user types
            else:
                logger.error(f"User {user.username} is not authorized to create this trip.")
                raise ValidationError("You are not authorized to create this trip.")

        except Vehicle.DoesNotExist:
            logger.error(f"Vehicle {vehicle_id} does not exist.")
            raise ValidationError("The selected vehicle does not exist.")
        
class TripDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a specific trip.
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'driver':
            return Trip.objects.filter(driver=user)
        elif user.user_type == 'supervisor':
            return Trip.objects.filter(supervisor=user)
        return Trip.objects.none()


class SupervisorListView(generics.ListAPIView):
    """
    List all supervisors.
    """
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only users of type 'supervisor'
        return CustomUser.objects.filter(user_type='supervisor')
    
class CurrentUserDetailsView(generics.RetrieveAPIView):
    """
    Retrieve details of the currently authenticated user.
    """
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Return the current authenticated user
        return self.request.user
    
# Login View (Using SimpleJWT)
class LoginView(TokenObtainPairView):
    """
    Handles user login and returns access and refresh tokens.
    """
    permission_classes = [permissions.AllowAny]  # Publicly accessible