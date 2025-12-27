from django.contrib import admin
from .models import Student, Course

# This allows you to manage these tables in the Admin Panel
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name') # Shows ID and Name in the list

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'roll_number', 'course') # Shows these columns
    list_filter = ('course',) # Adds a filter sidebar to sort by Course
    search_fields = ('name', 'roll_number') # Adds a search bar