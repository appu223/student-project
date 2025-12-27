from django.contrib import admin
from .models import Author, Book, BorrowRecord

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_borrowed', 'borrowed_by')

# ADD THIS to see the history table
@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'book', 'borrow_date', 'return_date')