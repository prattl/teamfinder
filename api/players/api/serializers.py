from common.models import Position, Region
from players.models import Player
from rest_framework import serializers
from teams.models import Team


class PlayerTeamSerializer(serializers.ModelSerializer):
    """Serializer for nesting a Team object inside a Player"""
    url = serializers.HyperlinkedIdentityField(view_name='team-detail')
    captain = serializers.PrimaryKeyRelatedField(read_only=True)
    creator = serializers.PrimaryKeyRelatedField(read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'captain',
            'creator',
        )
        return queryset

    class Meta:
        model = Team
        fields = (
            'id',
            'name',
            'captain',
            'creator',
            'url',
        )
        read_only_fields = (
            'id',
            'name',
            'captain',
            'creator',
            'url',
        )


class BasePlayerSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='player-detail')

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.prefetch_related(
            'positions',
            'regions',
            'teams',
        )
        return queryset

    class Meta:
        model = Player
        fields = (
            'id',
            'url',
            'username',
            'user',
            'skill_bracket',
            'regions',
            'positions',
            'teams',
        )
        read_only_fields = (
            'id',
            'url',
            'user',
        )


class FlatPlayerSerializer(BasePlayerSerializer):
    pass


class PlayerSerializer(BasePlayerSerializer):
    regions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    positions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    teams = PlayerTeamSerializer(read_only=True, many=True)



