from rest_framework import serializers
from .models import Quiz, Question, Option, QuizResult

# 1. SAFE OPTION (For Students: Hides 'is_correct' field)
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text']

# 2. ADMIN OPTION (For Teachers: Allows saving 'is_correct')
class OptionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'

# 3. QUESTION (Nests options inside)
class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'text', 'quiz', 'options']

# 4. QUIZ (Nests questions inside)
class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']

# 5. RESULT (For showing the scoreboard)
class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = '__all__'