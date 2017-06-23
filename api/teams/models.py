from common.models import AbstractBaseModel, CreatableModel, UpdateableModel, UUIDModel
from django.db import models


class Team(AbstractBaseModel):
    name = models.CharField(max_length=255)
    players = models.ManyToManyField('players.Player', through='common.TeamMember', related_name='teams')
    deprecated_skill_bracket = models.ForeignKey('common.SkillBracket', null=True, blank=True,
                                                 on_delete=models.SET_NULL)
    regions = models.ManyToManyField('common.Region', related_name='teams', blank=True)
    available_positions = models.ManyToManyField('common.Position', related_name='teams', blank=True)
    captain = models.ForeignKey('players.Player', null=True, blank=True, related_name='teams_captain_of',
                                on_delete=models.SET_NULL)
    creator = models.ForeignKey('players.Player', null=True, blank=True, related_name='teams_created',
                                on_delete=models.SET_NULL)

    # TODO:
    # accepting_applications = models.BooleanField(default=True)

    @property
    def actively_recruiting(self):
        return self.available_positions.exists()

    def __str__(self):
        return self.name
