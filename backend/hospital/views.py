from rest_framework import viewsets
from rest_framework.response import Response
from .models import Doctor, Patient, Appointment
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by('date', 'time')
    serializer_class = AppointmentSerializer

    def create(self, request, *args, **kwargs):
        doctor_id = request.data.get('doctor')
        date = request.data.get('date')
        time = request.data.get('time')

        # LOGIC: Check if this Doctor already has an appointment at this Date + Time
        exists = Appointment.objects.filter(
            doctor_id=doctor_id, 
            date=date, 
            time=time
        ).exists()

        if exists:
            return Response(
                {'error': 'Doctor is already booked at this time! Please choose another slot.'}, 
                status=400
            )

        return super().create(request, *args, **kwargs)