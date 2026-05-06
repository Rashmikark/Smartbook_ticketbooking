from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'bookings', views.BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('booking/create/', views.create_booking),
    path('booking/my/', views.my_bookings),
    path('booking/verify/<str:booking_id>/', views.verify_qr),
    path('booking/lock-seats/', views.lock_seats),
]