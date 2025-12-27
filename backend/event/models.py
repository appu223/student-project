from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=100)
    total_capacity = models.IntegerField() # e.g., 100 seats
    
    # Helper to count current registrations
    @property
    def registered_count(self):
        return self.attendees.count()

    @property
    def is_full(self):
        return self.registered_count >= self.total_capacity

    def __str__(self): return self.name

class Attendee(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # LOGIC: Prevent Duplicate Registration (Same Email + Same Event = Error)
        unique_together = ('event', 'email')

    def __str__(self): return f"{self.name} - {self.event.name}"