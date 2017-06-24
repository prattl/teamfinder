from django.contrib.auth import get_user_model
from django.test import TestCase
from common.models import (
    CreatableModel,
    Position,
    Region,
    TeamMember,
    UpdateableModel,
)
from teams.models import Team
import datetime

User = get_user_model()


class ModelTests(TestCase):
    def assertAbstractModelSaveRaises(self, instance):
        self.assertRaises(AttributeError, instance.save)

    def test_CreatableModel(self, instance=CreatableModel()):
        self.assertIsInstance(instance.created, datetime.datetime)
        self.assertAbstractModelSaveRaises(instance)

    def test_UpdateableModel(self, instance=UpdateableModel()):
        self.assertIsInstance(instance.updated, type(None))
        self.assertAbstractModelSaveRaises(instance)

    def test_Region(self):
        self.assertEqual(Region.objects.count(), 12)
        self.assertTrue(Region.objects.first().name < Region.objects.last().name)
        region = Region.objects.first()
        self.assertTrue(type(region).__name__ in repr(region))
        self.assertTrue(region.name in repr(region))
        self.assertTrue(region.name in str(region))

    def test_Position(self):
        self.assertEqual(Position.objects.count(), 8)
        self.assertEqual(Position.objects.primary().count(), 6)
        self.assertEqual(Position.objects.secondary().count(), 3)
        self.assertTrue(Position.objects.first().name < Position.objects.last().name)
        primary_position = Position.objects.primary().first()
        secondary_position = Position.objects.secondary().first()
        self.assertTrue(type(primary_position).__name__ in repr(primary_position))
        self.assertTrue(primary_position.name in repr(primary_position))
        self.assertTrue(primary_position.name in str(primary_position))
        self.assertTrue('secondary' in repr(secondary_position))

    def test_TeamMember(self):
        user = User.objects.create_user(email='lenny+tftests@prattdev.net', password='012345678')
        player = user.player
        player.username = 'testuser'
        player.save()
        team = Team.objects.create(name='Test Team')
        position = Position.objects.first()
        team_member = TeamMember.objects.create(player=player, team=team, position=position)
        self.assertTrue(player.username in repr(team_member))
        self.assertTrue(player.username in str(team_member))
        self.assertTrue(team.name in repr(team_member))
        self.assertTrue(position.name in repr(team_member))
        self.assertEqual(team.teammember_set.get(), team_member)
        self.assertEqual(player.teammember_set.get(), team_member)
        self.assertEqual(team.players.get(), player)
        self.assertEqual(player.teams.get(), team)

    def test_Application(self):
        # TODO
        pass

    def test_Invitation(self):
        # TODO
        pass
