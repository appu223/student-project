from rest_framework import serializers
from .models import Supplier, Product

class SupplierSerializer(serializers.ModelSerializer):
    class Meta: model = Supplier; fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    is_low_stock = serializers.ReadOnlyField() # Send the alert status to React

    class Meta: model = Product; fields = '__all__'