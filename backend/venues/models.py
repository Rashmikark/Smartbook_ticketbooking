from events.models import Event
from django.db import models

class Venue(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    address = models.TextField()
    total_seats = models.IntegerField(default=200)
    amenities = models.CharField(max_length=300, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.city}"


class Show(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    show_date = models.DateField()
    show_time = models.TimeField()
    screen = models.CharField(max_length=50, blank=True)
    total_seats = models.IntegerField(default=200)
    available_seats = models.IntegerField(default=200)
    price_premium = models.DecimalField(max_digits=8, decimal_places=2, default=350)
    price_gold = models.DecimalField(max_digits=8, decimal_places=2, default=250)
    price_silver = models.DecimalField(max_digits=8, decimal_places=2, default=180)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.event.title} - {self.venue.name} - {self.show_date} {self.show_time}"