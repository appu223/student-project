from rest_framework import serializers
from .models import Doctor, Patient, Appointment

class DoctorSerializer(serializers.ModelSerializer):
    class Meta: model = Doctor; fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta: model = Patient; fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.name')
    patient_name = serializers.ReadOnlyField(source='patient.name')

    class Meta: model = Appointment; fields = '__all__'