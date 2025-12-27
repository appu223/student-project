from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Project 1: Student Management
from base.views import StudentViewSet, CourseViewSet

# Project 2: Library System
from library.views import AuthorViewSet, BookViewSet, BorrowRecordViewSet

# Project 3: Expense Tracker
from expense.views import CategoryViewSet, ExpenseViewSet

# Project 4: Blog Platform
from blog.views import PostViewSet, CommentViewSet

# Project 5: Employee Leave
from leave.views import EmployeeViewSet, LeaveRequestViewSet

# Project 6: Inventory System
from inventory.views import SupplierViewSet, ProductViewSet

# Project 7: Event Registration
from event.views import EventViewSet, AttendeeViewSet

# Project 8: Quiz Manager
from quiz.views import QuizViewSet, QuestionViewSet, OptionViewSet, QuizResultViewSet

from hospital.views import DoctorViewSet, PatientViewSet, AppointmentViewSet # Import

router = DefaultRouter()

# --- REGISTRATIONS ---
# 1. Student System
router.register('students', StudentViewSet)
router.register('courses', CourseViewSet)

# 2. Library System
router.register('authors', AuthorViewSet)
router.register('books', BookViewSet)
router.register('borrow-records', BorrowRecordViewSet)

# 3. Expense Tracker
router.register('categories', CategoryViewSet)
router.register('expenses', ExpenseViewSet)

# 4. Blog Platform
router.register('posts', PostViewSet)
router.register('comments', CommentViewSet)

# 5. Leave Management
router.register('employees', EmployeeViewSet)
router.register('leaves', LeaveRequestViewSet)

# 6. Inventory System
router.register('suppliers', SupplierViewSet)
router.register('products', ProductViewSet)

# 7. Event System
router.register('events', EventViewSet)
router.register('attendees', AttendeeViewSet)

# 8. Quiz System
router.register('quizzes', QuizViewSet)
router.register('questions', QuestionViewSet)
router.register('options', OptionViewSet)
router.register('results', QuizResultViewSet) # <--- NEW: To see student scores

router.register('doctors', DoctorViewSet)
router.register('patients', PatientViewSet)
router.register('appointments', AppointmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]