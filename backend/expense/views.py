from rest_framework import viewsets
from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date') # Newest first
    serializer_class = ExpenseSerializer