from rest_framework import serializers
from .models import CustomUser, Vehicle, Trip


# Custom User Serializer
class CustomUserSerializer(serializers.ModelSerializer):
    supervisor = serializers.StringRelatedField(read_only=True)  # Display supervisor username instead of ID

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'supervisor', "password"]

class CustomUserSerializer1(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']  # Fields allowed for update
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},  # Password is optional for updates
            'user_type': {'read_only': True},  # Prevent user_type from being updated
            'supervisor': {'read_only': True},  # Prevent supervisor from being updated
        }

    def create(self, validated_data):
        # Hash the password before saving the user
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        # Handle password updates if provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # Hash the new password
        return super().update(instance, validated_data)

# Vehicle Serializer
class VehicleSerializer(serializers.ModelSerializer):
    assigned_driver =  serializers.StringRelatedField()  # This will return the driver's username
    supervisor = serializers.StringRelatedField(read_only=True)  # Supervisor username

    class Meta:
        model = Vehicle
        fields = ['id', 'vehicle_name', 'vehicle_number', 'assigned_driver', 'supervisor',
                  'last_maintenance_date', 'next_maintenance_date', 'latitude', 'longitude','last_updated']


# Trip Serializer
class TripSerializer(serializers.ModelSerializer):
    vehicle = serializers.StringRelatedField(read_only=True)  # Display vehicle name
    driver = serializers.StringRelatedField(read_only=True)  # Display driver username
    supervisor = serializers.StringRelatedField(read_only=True)  # Display supervisor username
    vehicle_id = serializers.PrimaryKeyRelatedField(
        source="vehicle", queryset=Vehicle.objects.all()
    )

    class Meta:
        model = Trip
        fields = [
            'id', 'vehicle_id', 'vehicle', 'driver', 'supervisor', 'start_time', 'end_time',
            'vehicle_status', 'destination', 'start_mileage', 'end_mileage', 'distance_covered'
        ]

    def validate_vehicle(self, value):
        if not value:
            raise serializers.ValidationError("A vehicle must be selected.")
        return value