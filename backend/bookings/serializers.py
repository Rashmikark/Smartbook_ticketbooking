from rest_framework import serializers
from .models import Booking, SeatLock

class BookingSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='show.event.title', read_only=True)
    venue_name = serializers.CharField(source='show.venue.name', read_only=True)
    show_date = serializers.DateField(source='show.show_date', read_only=True)
    show_time = serializers.TimeField(source='show.show_time', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

class SeatLockSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatLock
        fields = '__all__'