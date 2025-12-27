from django.contrib import admin
from .models import Quiz, Question, Option

class OptionInline(admin.TabularInline):
    model = Option

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline] # Show options inside Question page
    list_display = ('text', 'quiz')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title',)