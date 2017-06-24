from django.db.models import Q

from common.api.permissions import IsStaffOrTargetPlayer
from common.models import Interest, Language, Region, Position, Application, Status
from players.models import Player
from rest_framework import permissions, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from .serializers import FlatPlayerSerializer, PlayerSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    model = Player
    permission_classes = (IsStaffOrTargetPlayer, )

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.get_serializer_class().setup_eager_loading(queryset)

        keywords = self.request.query_params.get('keywords')
        regions = self.request.query_params.getlist('regions[]')
        positions = self.request.query_params.getlist('positions[]')
        interests = self.request.query_params.getlist('interests[]')
        languages = self.request.query_params.getlist('languages[]')
        min_mmr = self.request.query_params.get('min_mmr')
        max_mmr = self.request.query_params.get('max_mmr')
        include_estimated_mmr = self.request.query_params.get('include_estimated_mmr')

        if keywords:
            queryset = queryset.filter(user__username__icontains=keywords)
        if regions:
            queryset = queryset.filter(regions__in=Region.objects.filter(pk__in=regions))
        if positions:
            queryset = queryset.filter(positions__in=Position.objects.filter(pk__in=positions))
        if interests:
            queryset = queryset.filter(interests__in=Interest.objects.filter(pk__in=interests))
        if languages:
            queryset = queryset.filter(languages__in=Language.objects.filter(pk__in=languages))

        if min_mmr:
            min_mmr_query = Q(mmr__gte=min_mmr)
            if include_estimated_mmr:
                query = Q(mmr__isnull=True, mmr_estimate__gte=min_mmr) | min_mmr_query
            else:
                query = min_mmr_query
            queryset = queryset.filter(query)
        if max_mmr:
            max_mmr_query = Q(mmr__lte=max_mmr)
            if include_estimated_mmr:
                query = Q(mmr__isnull=True, mmr_estimate__lte=max_mmr) | max_mmr_query
            else:
                query = max_mmr_query
            queryset = queryset.filter(query)

        return queryset.order_by('-user__last_login')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).have_complete_profile()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @list_route(url_path='me', permission_classes=(permissions.IsAuthenticated, ), methods=('GET', ))
    def me(self, request):
        player = request.user.player
        serializer = self.get_serializer(player)
        return Response(serializer.data)

    @list_route(url_path='me/new_items', permission_classes=(permissions.IsAuthenticated, ), methods=('GET', ))
    def new_items(self, request):
        player = request.user.player
        return Response({
            'new_team_applications': Application.objects.filter(team__captain=player, status=Status.PENDING).count(),
            'new_invitations': player.invitation_set.filter(status=Status.PENDING).count()
        })

    # # TODO: This isn't really useful anymore after redesign
    # @detail_route(methods=('GET', ))
    # def memberships(self, request, pk=None):
    #     player = self.get_object()
    #     request_context = {'request': request}
    #     serializer = TeamMembershipSerializer(player.teammember_set.all(), many=True, context=request_context)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = FlatPlayerSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_player = self.perform_update(serializer)
        full_player = PlayerSerializer(instance=updated_player, context={'request': request})
        return Response(full_player.data)

    def perform_update(self, serializer):
        return serializer.save()
