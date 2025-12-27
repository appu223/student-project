from rest_framework import serializers
from .models import Employee, LeaveRequest

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta: model = Employee; fields = '__all__'

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.name')
    
    class Meta: model = LeaveRequest; fields = '__all__'