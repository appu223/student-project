from rest_framework import viewsets
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Event, Attendee
from .serializers import EventSerializer, AttendeeSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer

class AttendeeViewSet(viewsets.ModelViewSet):
    queryset = Attendee.objects.all().order_by('-registered_at')
    serializer_class = AttendeeSerializer

    def create(self, request, *args, **kwargs):
        event_id = request.data.get('event')
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=404)

        # LOGIC 1: Check Capacity
        if event.is_full:
            return Response({'error': 'Event is fully booked!'}, status=400)

        # LOGIC 2: Create (Handle Duplicates via Try/Except)
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response({'error': 'This email is already registered for this event!'}, status=400)