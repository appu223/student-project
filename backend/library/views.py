from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Author, Book, BorrowRecord
from .serializers import AuthorSerializer, BookSerializer, BorrowRecordSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class BorrowRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowRecord.objects.all().order_by('-borrow_date')
    serializer_class = BorrowRecordSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=True, methods=['post'])
    def borrow(self, request, pk=None):
        book = self.get_object()
        if book.is_borrowed:
            return Response({'error': 'Book already borrowed'}, status=400)
        
        # Get detailed info from Frontend
        name = request.data.get('name')
        email = request.data.get('email')
        mobile = request.data.get('mobile')

        # 1. Create a History Record
        BorrowRecord.objects.create(book=book, student_name=name, email=email, mobile=mobile)

        # 2. Update Book Status
        book.is_borrowed = True
        book.borrowed_by = name
        book.borrowed_at = timezone.now() # Start the Timer!
        book.save()
        return Response({'status': 'Borrowed successfully'})

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        book = self.get_object()
        
        # Close the active record (Add return time)
        active_record = BorrowRecord.objects.filter(book=book, return_date__isnull=True).first()
        if active_record:
            active_record.return_date = timezone.now()
            active_record.save()

        book.is_borrowed = False
        book.borrowed_by = None
        book.borrowed_at = None # Stop the Timer
        book.save()
        return Response({'status': 'Returned successfully'})