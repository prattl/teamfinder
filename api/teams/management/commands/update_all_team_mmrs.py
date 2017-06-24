from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone

from teams.models import Team


class Command(BaseCommand):
    def handle(self, *args, **options):
        start_date = timezone.now() - timedelta(days=7)
        teams = Team.objects.filter(Q(mmr_last_updated__isnull=True) | Q(mmr_last_updated__lt=start_date))
        self.stdout.write('Updating MMR for {} teams.'.format(teams.count()))
        for team in teams:
            team.update_mmr_average()
        self.stdout.write(self.style.SUCCESS('Finished updating all team MMRs.'))
