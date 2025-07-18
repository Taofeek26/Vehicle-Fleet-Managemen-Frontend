from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


# Custom User Model
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('supervisor', 'Supervisor'),
        ('driver', 'Driver'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    supervisor = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='drivers'
    )

    def __str__(self):
        return f"{self.username} ({self.user_type})"


# Vehicle Model
class Vehicle(models.Model):
    vehicle_name = models.CharField(max_length=100)
    vehicle_number = models.CharField(max_length=20, unique=True)
    assigned_driver = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={'user_type': 'driver'}
    )
    supervisor = models.ForeignKey(
                        CustomUser,
                        on_delete=models.CASCADE,
                        related_name='vehicles',
                        null=True,  # Allow null values
                        blank=True
                        )           


    def __str__(self):
        return f"{self.vehicle_name} ({self.vehicle_number})"

    last_maintenance_date = models.DateField(null=True, blank=True)  # Ensure this exists
    next_maintenance_date = models.DateField(null=True, blank=True)  # Ensure this exists

    # New Fields for Vehicle Tracking
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)


# Trip Model
class Trip(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, limit_choices_to={'user_type': 'driver'}
    )
    supervisor = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='trips', null=True,  # Allow null values
                        blank=True
    )
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    vehicle_status = models.TextField(null=True, blank=True)
    destination = models.CharField(max_length=255, null=True, blank=True)
    start_mileage = models.FloatField()
    end_mileage = models.FloatField(null=True, blank=True)
    distance_covered = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Auto-calculate distance_covered if both start and end mileage are available
        if self.start_mileage and self.end_mileage:
            self.distance_covered = self.end_mileage - self.start_mileage
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Trip by {self.driver.username} to {self.destination} on {self.vehicle.vehicle_name}"
