from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from base.views import StudentViewSet, CourseViewSet
# Import Library views
# ... existing imports ...
from library.views import AuthorViewSet, BookViewSet, BorrowRecordViewSet # Import new View

router = DefaultRouter()
router.register('students', StudentViewSet)
router.register('courses', CourseViewSet)
router.register('authors', AuthorViewSet)
router.register('books', BookViewSet)
router.register('borrow-records', BorrowRecordViewSet) # Add this line!

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]