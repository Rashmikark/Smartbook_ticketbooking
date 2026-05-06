from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_poster_url(self, obj):
        if obj.poster:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return f'http://127.0.0.1:8000{obj.poster.url}'
        return None