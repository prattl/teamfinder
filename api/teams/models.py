import statistics

from django.db import models
from django.utils import timezone

from common.models import AbstractBaseModel, CreatableModel, UpdateableModel, UUIDModel


class Team(AbstractBaseModel):
    name = models.CharField(max_length=255)
    bio = models.CharField(max_length=255, default='', blank=True)
    logo_url = models.CharField(max_length=255, null=True, blank=True)
    players = models.ManyToManyField('players.Player', through='common.TeamMember', related_name='teams')
    deprecated_skill_bracket = models.ForeignKey('common.SkillBracket', null=True, blank=True,
                                                 on_delete=models.SET_NULL)
    regions = models.ManyToManyField('common.Region', related_name='teams', blank=True)
    available_positions = models.ManyToManyField('common.Position', related_name='teams', blank=True)
    interests = models.ManyToManyField('common.Interest', related_name='teams', blank=True)
    languages = models.ManyToManyField('common.Language', related_name='teams', blank=True)
    captain = models.ForeignKey('players.Player', null=True, blank=True, related_name='teams_captain_of',
                                on_delete=models.SET_NULL)
    creator = models.ForeignKey('players.Player', null=True, blank=True, related_name='teams_created',
                                on_delete=models.SET_NULL)

    mmr_average = models.IntegerField(null=True, blank=True)
    mmr_last_updated = models.DateTimeField(null=True, blank=True)

    search_score = models.IntegerField(default=0)

    # TODO:
    # accepting_applications = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        try:
            Team.objects.get(pk=self.pk)
        except Team.DoesNotExist:
            new_team = True
        else:
            new_team = False

        self.update_search_score()

        super(Team, self).save(*args, **kwargs)

        if new_team:
            self.update_mmr_average()

    def update_mmr_average(self):
        player_mmrs = [player.most_accurate_mmr for player in self.players.all() if player.most_accurate_mmr > -1]
        self.mmr_average = int(statistics.mean(player_mmrs)) if len(player_mmrs) > 0 else -1
        self.mmr_last_updated = timezone.now()
        self.save()

    def update_search_score(self):
        profile_score = 0
        logo_score = 10 if self.logo_url else 0  # TODO: Broken logo URLs?

        if self.bio:
            profile_score += 1
        if self.interests.exists():
            profile_score += 1
        if self.languages.exists():
            profile_score += 1

        new_score = profile_score + logo_score
        if new_score != self.search_score:
            self.search_score = new_score

    @property
    def actively_recruiting(self):
        return self.available_positions.exists()

    def __str__(self):
        return self.name
