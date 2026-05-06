from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'venues', views.VenueViewSet)
router.register(r'shows', views.ShowViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('shows/event/<int:event_id>/', views.shows_by_event),
    path('shows/city/<str:city>/', views.shows_by_city),
    path('venues/city/<str:city>/', views.venues_by_city),
]