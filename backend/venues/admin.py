from django.contrib import admin
from .models import Venue, Show

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'state', 'total_seats', 'is_active']
    list_filter = ['city', 'state', 'is_active']
    search_fields = ['name', 'city']

@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ['event', 'venue', 'show_date', 'show_time', 'available_seats', 'is_active']
    list_filter = ['show_date', 'is_active']
    search_fields = ['event__title', 'venue__name']