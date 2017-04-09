from django.contrib.postgres.fields import JSONField
from django.db import models

from common.models import AbstractBaseModel


class FeedbackType:
    BUG = 0
    FEATURE_REQUEST = 1
    COMMENT = 2
    CHOICES = (
        (BUG, 'Bug'),
        (FEATURE_REQUEST, 'Feature request'),
        (COMMENT, 'Comment'),
    )


class Feedback(AbstractBaseModel):
    player = models.ForeignKey('players.Player', null=True, blank=True, on_delete=models.SET_NULL)
    type = models.IntegerField(choices=FeedbackType.CHOICES)
    comments = models.CharField(max_length=2048)
    url = models.URLField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, null=True, blank=True)
    redux_state = JSONField(null=True, blank=True)
