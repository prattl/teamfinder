from common.api.serializers import MembershipSerializer
from common.models import Interest, Language, Position, Region
from players.models import Player
from teams.models import Team
from rest_framework import serializers


class TeamPlayerSerializer(serializers.ModelSerializer):
    """Serializer for nesting a Player object inside a Team"""
    url = serializers.HyperlinkedIdentityField(view_name='player-detail')
    regions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    positions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    username = serializers.CharField(source='user.username', read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.prefetch_related(
            'positions',
            'regions',
        ).select_related(
            'user',
        )
        return queryset

    class Meta:
        model = Player
        fields = (
            'id',
            'url',
            'username',
            'user',
            'regions',
            'positions',
        )
        read_only_fields = (
            'id',
            'url',
            'username',
            'user',
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
    interests = serializers.PrimaryKeyRelatedField(queryset=Interest.objects.all(), many=True)
    languages = serializers.PrimaryKeyRelatedField(queryset=Language.objects.all(), many=True)
    team_members = PlayerMembershipSerializer(source='teammember_set', many=True, read_only=True)
    captain = TeamPlayerSerializer()
    creator = TeamPlayerSerializer(read_only=True)

    class Meta:
        model = Team
        fields = (
            'id',
            'url',
            'name',
            'logo_url',
            'regions',
            'available_positions',
            'interests',
            'languages',
            'team_members',
            'captain',
            'creator',
            'mmr_average',
            'updated',
        )
        read_only_fields = (
            'id',
            'url',
            'team_members',
            'creator',
            'mmr_average',
            'updated',
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
            'logo_url',
            'regions',
            # 'player_position',  # TODO
            'available_positions',
            'interests',
            'languages',
            'captain',
            'creator',
            'mmr_average',
            'url',
        )
        read_only_fields = (
            'id',
            'captain',
            'creator',
            'mmr_average',
            'url',
        )

    def __init__(self, *args, **kwargs):
        super(FlatTeamSerializer, self).__init__(*args, **kwargs)
        self.fields['regions'].required = True


class EditableFlatTeamSerializer(serializers.ModelSerializer):

    @staticmethod
    def setup_eager_loading(queryset):
        return queryset

    class Meta:
        model = Team
        fields = (
            'id',
            'name',
            'logo_url',
            'regions',
            'available_positions',
            'interests',
            'languages',
            'captain',
            'creator',
            'mmr_average',
            'url',
        )
        read_only_fields = (
            'id',
            'url',
            'team_members',
            'mmr_average',
            'creator',
        )

    def validate_logo_url(self, value):
        if not value.startswith('https://dotateamfinder.s3.amazonaws.com/team-logos/'):
            raise serializers.ValidationError('Logo url must be registered to the dotateamfinder.com S3 bucket.')
        return value


class TeamMembershipSerializer(MembershipSerializer):
    """MembershipSerializer that nests the team object"""
    team = TeamSerializer()
