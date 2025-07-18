from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Vehicle, Trip


# Custom User Admin
class CustomUserAdmin(UserAdmin):
    """
    Admin panel customization for CustomUser model.
    Allows management of users with different user types (supervisor/driver).
    """
    model = CustomUser
    list_display = ('username', 'email', 'user_type', 'supervisor')
    list_filter = ('user_type', 'supervisor')
    fieldsets = UserAdmin.fieldsets + (
        ('User Type', {'fields': ('user_type', 'supervisor')}),
    )
    search_fields = ('username', 'email', 'user_type')


# Vehicle Admin
@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    """
    Admin panel customization for Vehicle model.
    Allows filtering, searching, and listing vehicles and their details.
    """
    list_display = ('vehicle_name', 'vehicle_number', 'assigned_driver', 'supervisor', 
                    'last_maintenance_date', 'next_maintenance_date')
    list_filter = ('last_maintenance_date', 'next_maintenance_date', 'assigned_driver', 'supervisor')
    search_fields = ('vehicle_name', 'vehicle_number', 'assigned_driver__username', 'supervisor__username')


# Trip Admin
@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    """
    Admin panel customization for Trip model.
    Allows filtering, searching, and listing trip details.
    """
    list_display = ('vehicle', 'driver', 'supervisor', 'start_time', 'end_time', 
                    'destination', 'start_mileage', 'end_mileage', 'distance_covered')
    list_filter = ('vehicle', 'driver', 'supervisor', 'start_time', 'end_time')
    search_fields = ('vehicle__vehicle_name', 'driver__username', 'supervisor__username', 'destination')


# Register Custom User Model
admin.site.register(CustomUser, CustomUserAdmin)
