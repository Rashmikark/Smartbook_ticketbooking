from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'language', 'rating', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'language']