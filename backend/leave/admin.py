from django.contrib import admin
from .models import Employee, LeaveRequest

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'email')
    list_filter = ('department',)
    search_fields = ('name', 'email')

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('employee', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'start_date') # Filter by Approved/Rejected
    list_editable = ('status',) # <--- MAGIC: Change status directly in the list!