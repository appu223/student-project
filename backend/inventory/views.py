from rest_framework import viewsets, filters
from .models import Supplier, Product
from .serializers import SupplierSerializer, ProductSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('quantity') # Low stock appears first
    serializer_class = ProductSerializer
    
    # ENABLE SEARCH LOGIC
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku'] # Allow searching by Name or SKU Code