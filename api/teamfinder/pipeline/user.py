import requests
from django.conf import settings

USER_FIELDS = ['username', 'steamid']
FRIEND_URL = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={key}&steamid={steamid}" \
             "&relationship=friend"


def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        request_user_friends(user)
        return {'is_new': False}

    fields = dict((name, kwargs.get(name, details.get(name)))
                  for name in backend.setting('USER_FIELDS', USER_FIELDS))

    if not fields:
        return

    new_user = strategy.create_user(**fields)
    request_user_friends(new_user)
    return {
        'is_new': True,
        'user': new_user
    }


def request_user_friends(user):
    url = FRIEND_URL.format(steamid=user.steamid, key=settings.SOCIAL_AUTH_STEAM_API_KEY)
    response = requests.get(url)
    if response.ok:
        response_json = response.json()
        friends = response_json['friendslist']['friends']
        user.steam_friends = [friend['steamid'] for friend in friends]
        user.save()
