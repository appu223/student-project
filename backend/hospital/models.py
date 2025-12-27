from django.db import models

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100) # e.g., Cardiologist

    def __str__(self): return f"Dr. {self.name} ({self.specialization})"

class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    phone = models.CharField(max_length=15)

    def __str__(self): return self.name

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField() # Crucial for double booking check
    reason = models.TextField()

    def __str__(self): return f"{self.doctor.name} with {self.patient.name} on {self.date} at {self.time}"