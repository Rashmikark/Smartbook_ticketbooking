from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'category', 'language']

@api_view(['GET'])
def events_by_category(request, category):
    events = Event.objects.filter(
        category=category,
        is_active=True
    )
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)