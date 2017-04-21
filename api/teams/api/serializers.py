from common.api.serializers import MembershipSerializer
from common.models import Position, Region, SkillBracket
from players.models import Player
from teams.models import Team
from rest_framework import serializers


class TeamPlayerSerializer(serializers.ModelSerializer):
    """Serializer for nesting a Player object inside a Team"""
    url = serializers.HyperlinkedIdentityField(view_name='player-detail')
    regions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    positions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    username = serializers.CharField(source='user.username')

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.prefetch_related(
            'positions',
            'regions',
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
        )
        read_only_fields = (
            'id',
            'url',
            'username',
            'user',
            'skill_bracket',
            'regions',
            'positions',
        )


class PlayerMembershipSerializer(MembershipSerializer):
    """MembershipSerializer that nests the player object"""
    player = TeamPlayerSerializer()


class TeamSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='team-detail')
    regions = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), many=True)
    available_positions = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all(), many=True)
    team_members = PlayerMembershipSerializer(source='teammember_set', many=True, read_only=True)
    # captain = TeamPlayerSerializer()
    creator = TeamPlayerSerializer(read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'skill_bracket',
            'captain',
            'creator',
        ).prefetch_related(
            'regions',
            'available_positions',
            'captain__regions',
            'captain__positions',
            'captain__teams',
            'creator__regions',
            'creator__positions',
            'creator__teams',
            'teammember_set__player',
            'teammember_set__player__regions',
            'teammember_set__player__positions',
            'teammember_set__player__teams',
        )
        return queryset

    class Meta:
        model = Team
        fields = (
            'id',
            'url',
            'name',
            'skill_bracket',
            'regions',
            'available_positions',
            'team_members',
            'captain',
            'creator',
        )
        read_only_fields = (
            'id',
            'url',
            'team_members',
            'creator',
        )


# TODO: Difference between FlatTeamSerializer and EditableFlatTeamSerializer?

class FlatTeamSerializer(serializers.ModelSerializer):
    @staticmethod
    def setup_eager_loading(queryset):
        return queryset

    class Meta:
        model = Team
        fields = (
            'id',
            'name',
            'skill_bracket',
            'regions',
            # 'player_position',  # TODO
            'available_positions',
            'captain',
            'creator',
            'url',
        )
        read_only_fields = (
            'id',
            'captain',
            'creator',
            'url',
        )

    # def create(self, validated_data):
    #     try:
    #         validated_data['skill_bracket'] = SkillBracket.objects.get(pk=validated_data.pop('skill_bracket', None))
    #     except SkillBracket.DoesNotExist:
    #         pass
    #     team = Team.objects.create(**validated_data)
    #     return team

    def __init__(self, *args, **kwargs):
        super(FlatTeamSerializer, self).__init__(*args, **kwargs)
        self.fields['regions'].required = True
        self.fields['skill_bracket'].required = True

    # def validate(self, data):
    #     # import ipdb; ipdb.set_trace()
    #     return data


class EditableFlatTeamSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name='team-detail')

    # def validate_name(self, name):
    #     request = self.context['request']
    #     return name

    @staticmethod
    def setup_eager_loading(queryset):
        return queryset

    class Meta:
        model = Team
        fields = (
            'id',
            'name',
            'skill_bracket',
            'regions',
            'available_positions',
            'captain',
            'creator',
            'url',
        )
        read_only_fields = (
            'id',
            'url',
            'team_members',
            'creator',
        )

    def create(self, validated_data):
        skill_bracket = SkillBracket.objects.get(pk=validated_data.pop('skill_bracket'))
        team = Team.objects.create(skill_bracket=skill_bracket, **validated_data)
        return team

    # def validate(self, data):
    #     request = self.context['request']
    #     return data


class TeamMembershipSerializer(MembershipSerializer):
    """MembershipSerializer that nests the team object"""
    team = TeamSerializer()
