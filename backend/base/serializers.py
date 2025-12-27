from rest_framework import serializers
from .models import Student, Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    # This line shows the Course Name instead of just the ID number
    course_name = serializers.ReadOnlyField(source='course.name')

    class Meta:
        model = Student
        fields = '__all__'