from common.models import AbstractBaseModel
from django.conf import settings
from django.db import models


class Player(AbstractBaseModel):
    username = models.CharField(max_length=255)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skill_bracket = models.ForeignKey('common.SkillBracket', null=True, blank=True, on_delete=models.SET_NULL)
    regions = models.ManyToManyField('common.Region', related_name='players', blank=True)
    positions = models.ManyToManyField('common.Position', related_name='players', blank=True)

    class Meta:
        ordering = ['username']

    def __repr__(self):
        return "<{}: {}>".format(type(self).__name__, self.username)

    def __str__(self):
        return self.username
