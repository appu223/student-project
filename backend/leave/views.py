from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Employee, LeaveRequest
from .serializers import EmployeeSerializer, LeaveRequestSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all().order_by('-start_date')
    serializer_class = LeaveRequestSerializer

    # Custom Create to Check Overlap
    def create(self, request, *args, **kwargs):
        emp_id = request.data.get('employee')
        start = request.data.get('start_date')
        end = request.data.get('end_date')

        # Logic: Check if any existing approved leave overlaps with new dates
        # (Start A <= End B) and (End A >= Start B)
        overlapping = LeaveRequest.objects.filter(
            employee_id=emp_id,
            status='Approved'
        ).filter(
            Q(start_date__lte=end) & Q(end_date__gte=start)
        )

        if overlapping.exists():
            return Response({'error': 'Dates overlap with an existing approved leave!'}, status=400)

        return super().create(request, *args, **kwargs)

    # Custom Action: Approve/Reject
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        leave = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['Approved', 'Rejected']:
            leave.status = new_status
            leave.save()
            return Response({'status': 'updated'})
        return Response({'error': 'Invalid status'}, status=400)