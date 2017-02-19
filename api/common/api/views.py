from common.models import (
    Application,
    Invitation,
    Position,
    Region,
    SkillBracket,
    TeamMember,
)
from django.contrib.auth import get_user_model
from players.models import Player
from rest_framework import mixins, status, viewsets
# from rest_framework import generics, mixins, views

from rest_framework.response import Response
from teams.models import Team
from .permissions import (
    JoinableActionPermissions,
    MembershipPermissions,
)
from .serializers import (
    ApplicationSerializer,
    EditApplicationSerializer,
    EditMembershipAsCaptainSerializer,
    InvitationSerializer,
    PositionSerializer,
    ReadOnlyApplicationSerializer,
    RegionSerializer,
    SkillBracketSerializer,
    MembershipSerializer,
)

User = get_user_model()


class SkillBracketViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillBracket.objects.all()
    serializer_class = SkillBracketSerializer


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class PositionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class JoinableEventViewSet(viewsets.ModelViewSet):
    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.get_serializer_class().setup_eager_loading(queryset)

        # Only team captains can use the `team` parameter
        team_id = self.request.query_params.get('team')
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            team_id = None
        else:
            if self.request.user.player.id != team.captain_id:
                team_id = None

        if team_id:
            queryset = queryset.filter(team_id=team_id)
        else:
            if self.request.user.is_staff:
                # Enable the `player` parameter for staff users
                player_id = self.request.query_params.get('player')
                if player_id:
                    queryset = queryset.filter(player_id=player_id)
            else:
                queryset = queryset.filter(player=self.request.user.player)

        return queryset


class ApplicationViewSet(JoinableEventViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = (JoinableActionPermissions, )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApplicationSerializer
        if self.request.method in ('PUT', 'PATCH', ):
            return EditApplicationSerializer
        return ReadOnlyApplicationSerializer


class InvitationViewSet(JoinableEventViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = (JoinableActionPermissions, )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InvitationSerializer
        if self.request.method in ('PUT', 'PATCH', ):
            return EditApplicationSerializer
        return ReadOnlyApplicationSerializer


class MembershipViewSet(mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        mixins.ListModelMixin,
                        viewsets.GenericViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = (MembershipPermissions, )

    def get_serializer_class(self):
        serializer_class = MembershipSerializer
        try:
            team_member = self.get_object()
        except AssertionError:
            pass
        else:
            if self.request.method in ('PATCH', 'PUT', ) and self.request.user.player == team_member.team.captain:
                serializer_class = EditMembershipAsCaptainSerializer

        return serializer_class

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = MembershipSerializer.setup_eager_loading(queryset)

        player_id = self.request.query_params.get('player')
        team_id = self.request.query_params.get('team')

        if player_id:
            queryset = queryset.filter(player_id=player_id)
        if team_id:
            queryset = queryset.filter(team_id=team_id)

        return queryset

    def perform_destroy(self, instance):
        instance.delete(player_id=self.request.user.player.id)
