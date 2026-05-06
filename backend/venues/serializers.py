from rest_framework import serializers
from .models import Venue, Show

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'

class ShowSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_category = serializers.CharField(source='event.category', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    venue_city = serializers.CharField(source='venue.city', read_only=True)
    is_fast_filling = serializers.SerializerMethodField()

    class Meta:
        model = Show
        fields = '__all__'

    def get_is_fast_filling(self, obj):
        return obj.available_seats < 20