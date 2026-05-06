from django.db import models

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('Movies', 'Movies'),
        ('Comedy', 'Comedy'),
        ('Concerts', 'Concerts'),
        ('Sports', 'Sports'),
        ('Theatre', 'Theatre'),
    ]
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    language = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    certificate = models.CharField(max_length=10, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    poster = models.ImageField(upload_to='posters/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title