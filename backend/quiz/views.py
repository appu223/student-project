from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quiz, Question, Option, QuizResult
from .serializers import QuizSerializer, QuestionSerializer, OptionAdminSerializer, QuizResultSerializer

# 1. QUIZ VIEWSET (With Submit Logic)
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        user_answers = request.data.get('answers', {})
        student_name = request.data.get('student_name', 'Anonymous')

        score = 0
        total = quiz.questions.count()

        for question in quiz.questions.all():
            selected = user_answers.get(str(question.id))
            if selected:
                try:
                    option = Option.objects.get(id=selected, question=question)
                    if option.is_correct: score += 1
                except Option.DoesNotExist: pass
        
        # Save Result
        QuizResult.objects.create(
            quiz=quiz, 
            student_name=student_name, 
            score=score, 
            total_questions=total
        )

        return Response({'score': score, 'total': total, 'percentage': (score/total * 100) if total > 0 else 0})

# 2. QUESTION VIEWSET (Missing in your file!)
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

# 3. OPTION VIEWSET (Uses Admin Serializer to allow saving 'is_correct')
class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionAdminSerializer

# 4. RESULT VIEWSET
class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all().order_by('-submitted_at')
    serializer_class = QuizResultSerializer