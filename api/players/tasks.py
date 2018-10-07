import requests
from threading import Thread

from django.db import connection
from django.utils import timezone

from .models import Player


class OPENDOTA:
    PLAYERS = "https://api.opendota.com/api/players/{account_id}"


def _update_player_mmr(player_id):
    try:
        player = Player.objects.get(pk=player_id)
    except Player.DoesNotExist:
        return

    steamid32 = player.user.steamid32

    url = OPENDOTA.PLAYERS.format(account_id=steamid32)
    response = requests.get(url)
    json = response.json()

    mmr = json['solo_competitive_rank']
    mmr_estimate = json['mmr_estimate']['estimate']

    if mmr_estimate:
        player.mmr_estimate = mmr_estimate
    if mmr:
        player.mmr = int(mmr)

    player.mmr_last_updated = timezone.now()
    player.save()

    connection.close()


def update_player_mmr(player_id):
    Thread(target=_update_player_mmr, args=(player_id, )).start()
