from common.api.permissions import IsStaffOrTargetPlayer
from common.models import Region, Position
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
        skill_bracket = self.request.query_params.get('skill_bracket')

        if keywords:
            queryset = queryset.filter(username__icontains=keywords)
        if regions:
            queryset = queryset.filter(regions__in=Region.objects.filter(pk__in=regions))
        if positions:
            queryset = queryset.filter(positions__in=Position.objects.filter(pk__in=positions))
        if skill_bracket:
            queryset = queryset.filter(skill_bracket_id=skill_bracket)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).exclude(username='')

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
