from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self): return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=20, unique=True) # Stock Keeping Unit
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField() # Vital for Low Stock Alert
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='products')
    
    # Logic: Alert if stock is below 10
    @property
    def is_low_stock(self):
        return self.quantity < 10

    def __str__(self): return self.name