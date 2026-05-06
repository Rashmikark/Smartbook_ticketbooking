from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Venue, Show
from .serializers import VenueSerializer, ShowSerializer

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.filter(is_active=True)
    serializer_class = VenueSerializer

class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.filter(is_active=True)
    serializer_class = ShowSerializer

@api_view(['GET'])
def shows_by_event(request, event_id):
    shows = Show.objects.filter(
        event_id=event_id,
        is_active=True
    )
    serializer = ShowSerializer(shows, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def shows_by_city(request, city):
    shows = Show.objects.filter(
        venue__city=city,
        is_active=True
    )
    serializer = ShowSerializer(shows, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def venues_by_city(request, city):
    venues = Venue.objects.filter(
        city=city,
        is_active=True
    )
    serializer = VenueSerializer(venues, many=True)
    return Response(serializer.data)