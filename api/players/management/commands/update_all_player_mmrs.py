import time
from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from django.utils import timezone

from players.models import Player


class Command(BaseCommand):
    def handle(self, *args, **options):
        start_date = timezone.now() - timedelta(days=7)
        players = Player.objects.filter(Q(mmr_last_updated__isnull=True) | Q(mmr_last_updated__lt=start_date))
        self.stdout.write('Updating MMR for {} players.'.format(players.count()))
        for player in players:
            player.update_mmr()
            time.sleep(1)
        self.stdout.write(self.style.SUCCESS('Finished updating all player MMRs.'))
