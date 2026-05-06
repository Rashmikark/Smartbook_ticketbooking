from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('events/category/<str:category>/', views.events_by_category),
]