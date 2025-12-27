from django.db import models
from django.utils import timezone

class Author(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    isbn = models.CharField(max_length=13, unique=True)
    is_borrowed = models.BooleanField(default=False)
    # We keep this for quick access, but detailed info goes to BorrowRecord
    borrowed_by = models.CharField(max_length=100, blank=True, null=True) 
    borrowed_at = models.DateTimeField(null=True, blank=True) # NEW: For Timer

    def __str__(self): return self.title

# NEW MODEL: Stores history of every borrow
class BorrowRecord(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    student_name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.CharField(max_length=15)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)

    def __str__(self): return f"{self.student_name} - {self.book.title}"