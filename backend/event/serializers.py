from rest_framework import serializers
from .models import Event, Attendee

class AttendeeSerializer(serializers.ModelSerializer):
    class Meta: model = Attendee; fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    # Send these calculated fields to React
    registered_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()

    class Meta: model = Event; fields = '__all__'