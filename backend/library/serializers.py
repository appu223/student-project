from rest_framework import serializers
from .models import Author, Book, BorrowRecord

class AuthorSerializer(serializers.ModelSerializer):
    class Meta: model = Author; fields = '__all__'

class BorrowRecordSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.title')
    class Meta: model = BorrowRecord; fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.name')
    class Meta: model = Book; fields = '__all__'