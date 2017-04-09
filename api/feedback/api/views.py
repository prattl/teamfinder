from rest_framework import viewsets

from feedback.models import Feedback
from .serializers import FeedbackSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def perform_create(self, serializer):
        serializer_kwargs = {
            'user_agent': self.request.META.get('HTTP_USER_AGENT')
        }

        if self.request.user.is_authenticated() and self.request.user.player:
            serializer_kwargs['player'] = self.request.user.player

        serializer.save(**serializer_kwargs)
