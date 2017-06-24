from common.models import (
    Application,
    Interest,
    Invitation,
    Position,
    Region,
    TeamMember,
)
from django.contrib.auth import get_user_model
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import list_route

from rest_framework.response import Response
from teams.models import Team
from tf_auth.models import UserEmailPreferences
from .permissions import (
    JoinableActionPermissions,
    MembershipPermissions,
)
from .serializers import (
    ApplicationSerializer,
    EditApplicationSerializer,
    EditInvitationSerializer,
    EditMembershipAsCaptainSerializer,
    InterestSerializer,
    InvitationSerializer,
    PositionSerializer,
    ReadOnlyApplicationSerializer,
    ReadOnlyInvitationSerializer,
    RegionSerializer,
    MembershipSerializer,
    UserEmailPreferencesSerializer,
)

User = get_user_model()


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class PositionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class InterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer


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
            return EditInvitationSerializer
        return ReadOnlyInvitationSerializer


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.player.id == self.request.user.player.id and instance.team.captain.id == self.request.user.player.id:
            return Response({'error': 'You cannot remove yourself from the team if you are the captain.'},
                            status=status.HTTP_400_BAD_REQUEST)
        # return Response({{}, status=})
        return super(MembershipViewSet, self).destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.delete(player_id=self.request.user.player.id)


class UserEmailPreferencesViewSet(mixins.RetrieveModelMixin,
                                  mixins.UpdateModelMixin,
                                  mixins.ListModelMixin,
                                  viewsets.GenericViewSet):
    queryset = UserEmailPreferences.objects.all()
    serializer_class = UserEmailPreferencesSerializer
    # permission_classes = (UserEmailPreferencesPermissions, permissions.IsAuthenticated)

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        if self.request.user.is_authenticated and not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset

    @list_route(url_path='self', methods=('GET',))
    def self(self, request):
        user = request.user
        serializer = self.get_serializer(user.user_email_preferences)
        return Response(serializer.data)
