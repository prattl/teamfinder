from rest_framework import serializers

from feedback.models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = (
            'id',
            'created',
            'updated',
            'player',
            'type',
            'comments',
            'url',
            'user_agent',
            'redux_state',
        )
