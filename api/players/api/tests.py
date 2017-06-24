import random
from common.models import Position, Region
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, APITestCase
from players.api.serializers import PlayerSerializer
from players.models import Player

User = get_user_model()


def testdata():
    names = [
        'Tabatha',
        'Owen',
        'Jessi',
        'Onita',
        'Cordia',
        'Roscoe',
        'Allie',
        'Kira',
        'Mirian',
        'Siobhan',
        'Darcy',
        'Trudi',
        'Fredda',
        'Marlon',
        'Isela',
        'Camille',
        'Claud',
        'Shanelle',
        'Tamela',
        'Elayne',
        'Gertha',
        'Marguerita',
        'Vito',
        'Jeanett',
        'Adina',
        'Nicole',
        'Micki',
        'Georgia',
        'Thalia',
        'Shae',
        'Dana',
        'Lesli',
        'Emelda',
        'Letitia',
        'Maria',
        'Stanley',
        'Clair',
        'Gracia',
        'Adelia',
        'Rosie',
        'Maranda',
        'Adaline',
        'Verena',
        'Danille',
        'Vinita',
        'Aleta',
        'Santos',
        'Camie',
        'Elly',
    ]

    for i, name in enumerate(names):
        print('Creating user for {}'.format(name))
        user = User.objects.create_user(first_name=name,
                                        username=name,
                                        steamid=100+i,
                                        email='lenny+test-{}@teamfinder.com'.format(name),
                                        password='123')
        player = user.player
        player.username = name.lower()
        for i in range(0, random.randint(1, 3)):
            player.regions.add(Region.objects.order_by('?').first())
        for i in range(0, random.randint(1, 3)):
            player.positions.add(Position.objects.order_by('?').first())
        player.save()


class BasePlayerTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.authenticated_user = User.objects.create_user(email='lenny+tftests1@prattdev.net', password='01234567')
        cls.user = User.objects.create_user(email='lenny+tftests2@prattdev.net', password='01234567')
        cls.authenticated_player = cls.authenticated_user.player
        cls.authenticated_player.username = 'dazull1'
        cls.authenticated_player.save()
        cls.player = cls.user.player
        cls.player.username = 'dazull2'
        cls.player.save()
        cls.list_url = reverse('player-list')
        cls.authenticated_detail_url = reverse('player-detail', args=(cls.authenticated_player.pk, ))
        cls.detail_url = reverse('player-detail', args=(cls.player.pk, ))
        cls.me_url = reverse('player-me')
        # cls.memberships_url = '{}?player={}'.format(reverse('teammember-list'), cls.player.pk)


class PlayerSerializerTests(BasePlayerTests):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_PlayerSerializer(self):
        request = self.factory.get(self.detail_url)
        absolute_url = request.build_absolute_uri()
        serializer = PlayerSerializer(instance=self.player, context={'request': request})

        self.assertEqual(serializer.data, {'id': str(self.player.id),
                                           'username': str(self.player.username),
                                           'positions': list(self.player.positions.all()),
                                           'teams': list(self.player.teams.all()),
                                           'regions': list(self.player.regions.all()),
                                           'user': self.player.user.id,
                                           'url': absolute_url})


class UnauthenticatedPlayerListViewTests(BasePlayerTests):
    """Unauthenticated player requesting /players/"""
    url = reverse('player-list')

    def test_head(self):
        response = self.client.head(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_post(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_put(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UnauthenticatedPlayerMeViewTests(BasePlayerTests):
    """Unauthenticated player requesting /players/me/"""
    url = reverse('player-me')

    def test_head(self):
        response = self.client.head(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_put(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UnauthenticatedPlayerDetailViewTests(BasePlayerTests):
    """Unauthenticated player requesting /players/<player_pk>/"""
    @classmethod
    def setUpTestData(cls):
        super(UnauthenticatedPlayerDetailViewTests, cls).setUpTestData()
        cls.url = cls.detail_url

    def test_head(self):
        response = self.client.head(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_post(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_put(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthenticatedBasePlayerTests(BasePlayerTests):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        token, _ = Token.objects.get_or_create(user=cls.authenticated_user)
        cls.token = token

    def setUp(self):
        super().setUp()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


class AuthenticatedPlayerListViewTests(AuthenticatedBasePlayerTests):
    """Authenticated player requesting /players/"""
    url = reverse('player-list')

    def test_head(self):
        response = self.client.head(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_post(self):
        response = self.client.post(self.url)
        # This method should be allowed but will result in a 400 when no data is supplied
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class AuthenticatedPlayerMeViewTests(AuthenticatedBasePlayerTests):
    """Authenticated player requesting /players/me/"""
    url = reverse('player-me')

    def test_head(self):
        response = self.client.head(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_post(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_put(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class AuthenticatedPeerPlayerDetailViewTests(AuthenticatedBasePlayerTests):
    """Authenticated player requesting /players/<other_player_pk>/"""
    @classmethod
    def setUpTestData(cls):
        super(AuthenticatedPeerPlayerDetailViewTests, cls).setUpTestData()
        cls.url = cls.detail_url

    def test_head(self):
        response = self.client.head(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_post(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_put(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class AuthenticatedSelfPlayerDetailViewTests(AuthenticatedBasePlayerTests):
    """Authenticated player requesting /players/<player_pk>/"""
    @classmethod
    def setUpTestData(cls):
        super(AuthenticatedSelfPlayerDetailViewTests, cls).setUpTestData()
        cls.url = cls.authenticated_detail_url

    def test_head(self):
        response = self.client.head(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_options(self):
        response = self.client.options(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_post(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_put(self):
        data = {
            'positions': [],
            'user': self.authenticated_user.pk,
            'username': 'new_username',
            'regions': [],
            'teams': []
        }
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch(self):
        response = self.client.patch(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class UnauthenticatedPlayerListViewSetTests(BasePlayerTests):
    """Unauthenticated player requesting /players/"""
    def test_head(self):
        response = self.client.head(self.list_url)
        self.assertEqual(response.data['count'], Player.objects.count())

    def test_options(self):
        response = self.client.options(self.list_url)
        self.assertEqual(response.data['name'], 'Player List')
        self.assertTrue('application/json' in response.data['renders'])

    def test_get(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.data['count'], Player.objects.count())


class UnauthenticatedPlayerDetailViewSetTests(BasePlayerTests):
    """Unauthenticated player requesting /players/<player_pk>/"""
    def assertDataEqualsInstance(self, data):
        self.assertEqual(data['id'], str(self.player.id))
        self.assertEqual(data['username'], str(self.player.username))

    def test_head(self):
        response = self.client.head(self.detail_url)
        self.assertDataEqualsInstance(response.data)

    def test_options(self):
        response = self.client.options(self.detail_url)
        self.assertEqual(response.data['name'], 'Player Instance')
        self.assertTrue('application/json' in response.data['renders'])

    def test_get(self):
        response = self.client.get(self.detail_url)
        self.assertDataEqualsInstance(response.data)


class AuthenticatedPlayerListViewSetTests(AuthenticatedBasePlayerTests,
                                          UnauthenticatedPlayerListViewSetTests):
    """Authenticated player requesting /players/"""
    pass


class AuthenticatedPeerPlayerDetailViewSetTests(AuthenticatedBasePlayerTests,
                                                UnauthenticatedPlayerDetailViewSetTests):
    """Authenticated player requesting /players/<other_player_pk>/"""
    pass


class AuthenticatedSelfPlayerDetailViewSetTests(AuthenticatedBasePlayerTests,
                                                UnauthenticatedPlayerDetailViewSetTests):
    """Authenticated player requesting /players/<player_pk>/"""
    def assertDataEqualsInstance(self, data):
        self.assertEqual(data['id'], str(self.authenticated_player.id))
        self.assertEqual(data['username'], str(self.authenticated_player.username))

    def test_head(self):
        response = self.client.head(self.authenticated_detail_url)
        self.assertDataEqualsInstance(response.data)

    def test_options(self):
        response = self.client.options(self.authenticated_detail_url)
        self.assertEqual(response.data['name'], 'Player Instance')
        self.assertTrue('application/json' in response.data['renders'])

    def test_get(self):
        response = self.client.get(self.authenticated_detail_url)
        self.assertDataEqualsInstance(response.data)

    def test_put(self):
        data = {
            'positions': [],
            'regions': [],
            'teams': [],
            'username': 'new_username',
        }
        response = self.client.put(self.authenticated_detail_url, data)
        self.assertEqual(response.data['id'], str(self.authenticated_player.id))
        self.assertEqual(response.data['username'], 'new_username')
        self.assertEqual(response.data['positions'], [])
        data = {}
        response = self.client.put(self.authenticated_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch(self):
        data = {
            'username': 'new_username_2',
        }
        response = self.client.patch(self.authenticated_detail_url, data)
        self.assertEqual(response.data['id'], str(self.authenticated_player.id))
        self.assertEqual(response.data['username'], 'new_username_2')
