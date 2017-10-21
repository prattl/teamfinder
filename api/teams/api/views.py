from common.api.permissions import IsStaffOrTeamCaptain
from common.models import Interest, Language, Position, TeamMember, Region
from teams.api.serializers import EditableFlatTeamSerializer, TeamSerializer, PlayerMembershipSerializer
from teams.models import Team
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from .serializers import FlatTeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    model = Team
    permission_classes = (IsStaffOrTeamCaptain, )   # TODO: Create IsStaffOrTeamCaptain permission for put/patch/delete
                                                    # TODO: Create IsStaffOrPlayer permission for post

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'captain',
            'captain__user',
            'creator',
            'creator__user',
        ).prefetch_related(
            'regions',
            'available_positions',
            'captain__regions',
            'captain__positions',
            'captain__teams',
            'creator__regions',
            'creator__positions',
            'creator__teams',
            'players__regions',
            'teammember_set__player',
            'teammember_set__player__user',
            'teammember_set__player__regions',
            'teammember_set__player__positions',
            'teammember_set__player__teams',
        )
        return queryset

    def get_serializer_class(self):
        """
        If GET, HEAD, or OPTIONS return the nested serializer
        If POST, PUT, PATCH, or DELETE return a flat serializer

        Change the serializer based on permissions
          * If method is safe, return TeamSerializer
          * If user is the team captain, return EditableFlatTeamSerializer
          * Else, return FlatTeamSerializer
        """
        def _get_serializer_class():
            if self.request.method in permissions.SAFE_METHODS:
                return TeamSerializer
            try:
                instance = self.get_object()
            except AssertionError:
                pass
            else:
                if self.request.user == instance.captain.user:
                    return EditableFlatTeamSerializer
            return FlatTeamSerializer
        serializer_class = _get_serializer_class()
        return serializer_class

    def get_queryset_for_search(self, queryset):
        keywords = self.request.query_params.get('keywords')
        regions = self.request.query_params.getlist('regions[]')
        available_positions = self.request.query_params.getlist('available_positions[]')
        interests = self.request.query_params.getlist('interests[]')
        languages = self.request.query_params.getlist('languages[]')

        if keywords:
            queryset = queryset.filter(name__icontains=keywords)
        if regions:
            queryset = queryset.filter(regions__in=Region.objects.filter(pk__in=regions))
        if available_positions:
            queryset = queryset.filter(available_positions__in=Position.objects.filter(pk__in=available_positions))
        if interests:
            queryset = queryset.filter(interests__in=Interest.objects.filter(pk__in=interests))
        if languages:
            queryset = queryset.filter(languages__in=Language.objects.filter(pk__in=languages))

        return queryset.order_by('-search_score', '-updated', )

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.setup_eager_loading(queryset)

        search = self.request.query_params.get('search')
        if search:
            queryset = self.get_queryset_for_search(queryset)

        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        # Validate with the flat serializer
        serializer = FlatTeamSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        new_team = self.perform_create(serializer)
        try:
            player_position = Position.objects.get(pk=request.data.get('player_position'))
        except Position.DoesNotExist:
            player_position = None
        TeamMember.objects.create(team=new_team, player=request.user.player, position=player_position)
        headers = self.get_success_headers(serializer.data)
        # Return a nested serializer
        full_team = TeamSerializer(instance=new_team, context={'request': request})
        return Response(full_team.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        return serializer.save(creator=self.request.user.player, captain=self.request.user.player)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        updated_team = self.perform_update(serializer)
        try:
            # Try to update the requesting user's position within the team
            player_position = Position.objects.get(pk=request.data.get('player_position'))
            team_member = TeamMember.objects.get(team=updated_team, player=request.user.player)
            if player_position != team_member.position:
                team_member.position = player_position
                team_member.save()
        except (Position.DoesNotExist, TeamMember.DoesNotExist):
            pass
        full_team = TeamSerializer(instance=updated_team, context={'request': request})
        return Response(full_team.data)

    def perform_update(self, serializer):
        return serializer.save()

    @detail_route(permission_classes=(permissions.IsAuthenticated,), methods=('GET',))
    def memberships(self, request, pk=None):
        team = self.get_object()
        serializer = PlayerMembershipSerializer(
            team.teammember_set.all(), many=True, context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
