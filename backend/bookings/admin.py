from django.contrib import admin
from .models import Booking, SeatLock

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'user', 'show', 'seats', 'final_amount', 'status', 'is_used']
    list_filter = ['status', 'is_used']
    search_fields = ['booking_id', 'user__username']

@admin.register(SeatLock)
class SeatLockAdmin(admin.ModelAdmin):
    list_display = ['show', 'seats', 'locked_at', 'expires_at']