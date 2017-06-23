from common.models import AbstractBaseModel
from django.conf import settings
from django.db import models
from django.db.models import Count


class PlayerQuerySet(models.QuerySet):
    def have_complete_profile(self):
        return self.annotate(
            num_regions=Count('regions'),
            num_positions=Count('positions')
        ).exclude(user__username='').filter(
            user__username__isnull=False, skill_bracket__isnull=False, num_regions__gt=0, num_positions__gt=0
        )


class Player(AbstractBaseModel):
    username = models.CharField(max_length=255)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    deprecated_skill_bracket = models.ForeignKey('common.SkillBracket', null=True, blank=True, on_delete=models.SET_NULL)
    regions = models.ManyToManyField('common.Region', related_name='players', blank=True)
    positions = models.ManyToManyField('common.Position', related_name='players', blank=True)

    mmr = models.IntegerField(null=True, blank=True)
    mmr_estimate = models.IntegerField(null=True, blank=True)
    mmr_last_updated = models.DateTimeField(null=True, blank=True)

    # TODO:
    # searchable = models.BooleanField(default=True)

    objects = PlayerQuerySet.as_manager()

    def update_mmr(self):
        from .tasks import update_player_mmr
        update_player_mmr(self.pk)

    class Meta:
        ordering = ['user__username']

    def __repr__(self):
        return "<{}: {}>".format(type(self).__name__, self.user.username)

    def __str__(self):
        return self.user.username
