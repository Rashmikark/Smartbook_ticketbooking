from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register),
    path('auth/login/', views.login_view),
    path('auth/logout/', views.logout_view),
    path('auth/send-otp/', views.send_otp),
    path('auth/verify-otp/', views.verify_otp),
]