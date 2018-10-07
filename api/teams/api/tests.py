import random
from common.models import Position, Region, TeamMember
from django.contrib.auth import get_user_model
from django.urls import reverse
from players.models import Player
from teams.models import Team
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

User = get_user_model()


def testdata():
    for i in range(0, 24):
        captain = Player.objects.order_by('?').first()
        team = Team.objects.create(
            name='Team {}'.format(i),
            captain=captain,
            creator=captain,
        )
        for j in range(0, random.randint(1, 3)):
            team.regions.add(Region.objects.order_by('?').first())
        for j in range(0, random.randint(1, 3)):
            team.available_positions.add(Position.objects.order_by('?').first())
        team.save()
        TeamMember.objects.create(
            team=team,
            player=captain,
            position=Position.objects.order_by('?').first()
        )
        for j in range(0, 4):
            TeamMember.objects.create(
                team=team,
                player=Player.objects.exclude(pk=captain.pk).order_by('?').first(),
                position=Position.objects.order_by('?').first()
            )


class BaseTeamTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = User.objects.create_user(11, 'dazull', email='lenny+tftests@prattdev.net', password='01234567')
        cls.player = cls.user.player
        cls.owner = User.objects.create_user(12, 'dazull2', email='lenny+tftests2@prattdev.net', password='01234567')
        cls.owner_player = cls.owner.player
        cls.team = Team.objects.create(name='Team 123', captain=cls.owner_player, creator=cls.owner_player)
        cls.list_url = reverse('team-list')
        cls.detail_url = reverse('team-detail', args=(cls.team.pk, ))


class UnauthenticatedTeamListViewTests(BaseTeamTests):
    url = reverse('team-list')

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


class UnauthenticatedTeamDetailViewTests(BaseTeamTests):
    @classmethod
    def setUpTestData(cls):
        super(UnauthenticatedTeamDetailViewTests, cls).setUpTestData()
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


class AuthenticatedBaseTeamTests(BaseTeamTests):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        token, _ = Token.objects.get_or_create(user=cls.user)
        cls.token = token

    def setUp(self):
        super().setUp()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


class AuthenticatedAsOwnerBaseTeamTests(BaseTeamTests):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        token, _ = Token.objects.get_or_create(user=cls.owner)
        cls.token = token

    def setUp(self):
        super().setUp()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


class AuthenticatedTeamListViewTests(AuthenticatedBaseTeamTests):
    url = reverse('team-list')

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


class AuthenticatedTeamDetailViewTests(AuthenticatedBaseTeamTests):
    @classmethod
    def setUpTestData(cls):
        super(AuthenticatedTeamDetailViewTests, cls).setUpTestData()
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


class AuthenticatedAsOwnerTeamDetailViewTests(AuthenticatedAsOwnerBaseTeamTests):
    @classmethod
    def setUpTestData(cls):
        super(AuthenticatedAsOwnerTeamDetailViewTests, cls).setUpTestData()
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
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch(self):
        response = self.client.patch(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_delete(self):
        response = self.client.delete(self.url)
        self.assertTrue(200 <= response.status_code < 300)

    def test_trace(self):
        response = self.client.trace(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
