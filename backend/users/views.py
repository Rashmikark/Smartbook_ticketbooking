from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import UserProfile, OTP
import random

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    mobile = request.data.get('mobile', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    if not mobile:
        return Response({'error': 'Mobile number is required'}, status=400)
    if len(mobile) != 10 or not mobile.isdigit():
        return Response({'error': 'Enter a valid 10 digit mobile number'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    UserProfile.objects.create(
        user=user,
        mobile=mobile
    )

    # Generate OTP
    otp_code = str(random.randint(100000, 999999))
    OTP.objects.create(mobile=mobile, otp=otp_code)

    # In real app send SMS — for now print to console
    print(f'OTP for {mobile}: {otp_code}')

    return Response({
        'message': 'Account created! OTP sent to your mobile.',
        'mobile': mobile
    }, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    mobile = request.data.get('mobile')
    otp = request.data.get('otp')

    try:
        otp_obj = OTP.objects.filter(
            mobile=mobile,
            otp=otp,
            is_used=False
        ).latest('created_at')
        otp_obj.is_used = True
        otp_obj.save()
        return Response({'message': 'OTP verified successfully'})
    except OTP.DoesNotExist:
        return Response({'error': 'Invalid or expired OTP'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    mobile = request.data.get('mobile')
    if not mobile or len(mobile) != 10:
        return Response({'error': 'Valid mobile number required'}, status=400)

    otp_code = str(random.randint(100000, 999999))
    OTP.objects.create(mobile=mobile, otp=otp_code)

    # In real app send SMS — for now print to console
    print(f'OTP for {mobile}: {otp_code}')

    return Response({
        'message': f'OTP sent to {mobile}',
        'otp': otp_code  # Remove this in production!
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # ── Allow login with email too ──
    if username and '@' in username:
        try:
            username = User.objects.get(email=username).username
        except User.DoesNotExist:
            return Response({'error': 'No account found with this email'}, status=400)

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        try:
            profile = UserProfile.objects.get(user=user)
            mobile = profile.mobile
        except UserProfile.DoesNotExist:
            mobile = ''
        return Response({
            'token': token.key,
            'username': user.username,
            'is_staff': user.is_staff,
            'mobile': mobile
        })
    return Response({'error': 'Invalid username or password'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
    return Response({'message': 'Logged out'})