from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import random
import string
from .models import Booking, SeatLock
from .serializers import BookingSerializer, SeatLockSerializer
from venues.models import Show

def generate_booking_id():
    return 'SB' + ''.join(random.choices(string.digits, k=6))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    data = request.data
    show_id = data.get('show_id')
    seats = data.get('seats')
    payment_method = data.get('payment_method')
    payment_id = data.get('payment_id')

    try:
        show = Show.objects.get(id=show_id)
    except Show.DoesNotExist:
        return Response({'error': 'Show not found'}, status=404)

    booking_id = generate_booking_id()
    total_amount = float(data.get('total_amount', 0))
    convenience_fee = round(total_amount * 0.1, 2)
    discount = float(data.get('discount', 50))
    final_amount = total_amount + convenience_fee - discount

    booking = Booking.objects.create(
        user=request.user,
        show=show,
        booking_id=booking_id,
        seats=seats,
        total_amount=total_amount,
        convenience_fee=convenience_fee,
        discount=discount,
        final_amount=final_amount,
        payment_method=payment_method,
        payment_id=payment_id,
        status='confirmed'
    )

    show.available_seats -= len(seats.split(','))
    show.save()

    serializer = BookingSerializer(booking)
    return Response(serializer.data, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(
        user=request.user
    ).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def verify_qr(request, booking_id):
    try:
        booking = Booking.objects.get(booking_id=booking_id)
    except Booking.DoesNotExist:
        return Response({'valid': False, 'message': 'Invalid ticket'}, status=404)

    if booking.is_used:
        return Response({'valid': False, 'message': 'Ticket already used'})

    booking.is_used = True
    booking.save()
    return Response({
        'valid': True,
        'message': 'Valid ticket — allow entry',
        'booking': BookingSerializer(booking).data
    })

@api_view(['POST'])
def lock_seats(request):
    show_id = request.data.get('show_id')
    seats = request.data.get('seats')
    session_key = request.session.session_key or 'anonymous'

    if not request.session.session_key:
        request.session.create()
        session_key = request.session.session_key

    expires_at = timezone.now() + timedelta(minutes=5)

    SeatLock.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()

    lock = SeatLock.objects.create(
        show_id=show_id,
        seats=seats,
        session_key=session_key,
        expires_at=expires_at
    )

    return Response({'locked': True, 'expires_at': expires_at})

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer