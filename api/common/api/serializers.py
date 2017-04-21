from common.models import (
    Application,
    EmailTag,
    Invitation,
    Position,
    Region,
    SkillBracket,
    Status,
    TeamMember,
)
from django.contrib.auth import get_user_model
from players.models import Player
from rest_framework import serializers
from teams.models import Team
from tf_auth.models import EmailPreference, UserEmailPreferences

User = get_user_model()


class RegionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='region-detail')

    class Meta:
        model = Region
        fields = (
            'id',
            'name',
            'url',
        )
        readonly_fields = (
            'id',
            'name',
            'url',
        )


class PositionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='position-detail')

    class Meta:
        model = Position
        fields = (
            'id',
            'name',
            'secondary',
            'url',
        )
        readonly_fields = (
            'id',
            'name',
            'secondary',
            'url',
        )


class SkillBracketSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='skillbracket-detail')

    class Meta:
        model = SkillBracket
        fields = (
            'id',
            'name',
            'url',
        )
        read_only_fields = (
            'id',
            'name',
            'url',
        )


class ReadOnlyApplicationSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='application-detail')
    team = serializers.PrimaryKeyRelatedField(read_only=True)
    player = serializers.PrimaryKeyRelatedField(read_only=True)
    position = serializers.PrimaryKeyRelatedField(read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'team',
            'player',
            'position',
        )
        return queryset

    class Meta:
        model = Application
        fields = (
            'id',
            'created',
            'updated',
            'team',
            'player',
            'position',
            'status',
            'url',
        )
        read_only_fields = (
            'created',
            'status',
            'team',
            'player',
            'position',
            'status',
        )


class ApplicationSerializer(ReadOnlyApplicationSerializer):
    """Used for creating applications."""
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    player = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all())
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all())

    def validate(self, data):
        # Players can create applications for teams which:
        #   1. They don't already belong to
        #   2. They don't already have an application to
        team = data['team']
        player = data['player']
        user = self.context['request'].user
        current_player = user.player

        if current_player.id != player.id:
            raise serializers.ValidationError('You cannot create applications for other players.')
        if team.players.filter(id=current_player.id).exists():
            raise serializers.ValidationError('You are already on this team.')
        if current_player.application_set.filter(team_id=team.id).exists():
            raise serializers.ValidationError('You already applied to this team.')
        return data

    class Meta(ReadOnlyApplicationSerializer.Meta):
        read_only_fields = (
            'created',
            'status',
        )


class EditApplicationSerializer(ReadOnlyApplicationSerializer):
    """Used for changing status."""
    status = serializers.ChoiceField(Status.CHOICES)

    @staticmethod
    def _process_status_changed_as_player(current_status, new_status):
        if not (current_status == Status.PENDING and new_status == Status.WITHDRAWN):
            raise serializers.ValidationError('You cannot change application status to that value.')

    @staticmethod
    def _process_status_changed_as_captain(current_status, new_status):
        if not (current_status == Status.PENDING and new_status in (Status.ACCEPTED, Status.REJECTED)):
            raise serializers.ValidationError('You cannot change application status to that value.')

    def validate_status(self, new_status):
        # Only allowable state transfers:
        #   As player: PENDING --> WITHDRAWN
        #   As captain: PENDING --> ACCEPTED, PENDING --> REJECTED
        if self.instance:
            current_player = self.context['request'].user.player
            current_status = self.instance.status
            status_changed = current_status != new_status

            if status_changed:
                if current_player == self.instance.player:
                    self._process_status_changed_as_player(current_status, new_status)
                elif current_player == self.instance.team.captain:
                    self._process_status_changed_as_captain(current_status, new_status)

        return new_status

    class Meta(ReadOnlyApplicationSerializer.Meta):
        read_only_fields = (
            'created',
            'status',
            'team',
            'player',
            'position',
        )


class ReadOnlyInvitationSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='invitation-detail')
    team = serializers.PrimaryKeyRelatedField(read_only=True)
    player = serializers.PrimaryKeyRelatedField(read_only=True)
    position = serializers.PrimaryKeyRelatedField(read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'team',
            'player',
            'position',
        )
        return queryset

    class Meta:
        model = Invitation
        fields = (
            'id',
            'created',
            'updated',
            'team',
            'player',
            'position',
            'status',
            'url',
        )
        read_only_fields = (
            'created',
            'status',
            'team',
            'player',
            'position',
            'status',
        )


class InvitationSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='invitation-detail')
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    player = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all())
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all())
    created_by = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all())

    def validate(self, data):
        # Only captains can create invitations.
        # Captains can't invite players who:
        #   1. Already have been invited
        #   2. Has an application
        #   3. Are already on the team
        #   4. Are themselves
        team = data['team']
        player = data['player']
        user = self.context['request'].user
        current_player = user.player

        if current_player.id != team.captain.id:
            raise serializers.ValidationError('Only the team captain can create invitations.')

        if player.id == current_player.id:
            raise serializers.ValidationError('You cannot invite yourself.')

        if team.invitation_set.filter(player__id=player.id).exists():
            raise serializers.ValidationError('This player has already been invited.')

        if team.application_set.filter(player_id=player.id).exists():
            raise serializers.ValidationError('This player has already applied.')

        if team.players.filter(id=player.id).exists():
            raise serializers.ValidationError('This player is already on the team.')

        return data

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'team',
            'player',
            'position',
            'created_by',
        )
        return queryset

    class Meta:
        model = Invitation
        fields = (
            'id',
            'created',
            'updated',
            'team',
            'player',
            'position',
            'status',
            'created_by',
            'url',
        )
        read_only_fields = (
            'id',
            'created',
            'updated',
            'team',
            'player',
            'position',
            'created_by',
            'url',
        )


class EditInvitationSerializer(ReadOnlyInvitationSerializer):
    """Used for changing status."""
    status = serializers.ChoiceField(Status.CHOICES)

    @staticmethod
    def _process_status_changed_as_player(current_status, new_status):
        if not (current_status == Status.PENDING and new_status in (Status.ACCEPTED, Status.REJECTED)):
            raise serializers.ValidationError('You cannot change invitation status to that value.')

    @staticmethod
    def _process_status_changed_as_captain(current_status, new_status):
        if not (current_status == Status.PENDING and new_status == Status.WITHDRAWN):
            raise serializers.ValidationError('You cannot change invitation status to that value.')

    def validate_status(self, new_status):
        # Only allowable state transfers:
        #   As player: PENDING --> ACCEPTED, PENDING --> REJECTED
        #   As captain: PENDING --> WITHDRAWN
        if self.instance:
            current_player = self.context['request'].user.player
            current_status = self.instance.status
            status_changed = current_status != new_status

            if status_changed:
                if current_player == self.instance.player:
                    self._process_status_changed_as_player(current_status, new_status)
                elif current_player == self.instance.team.captain:
                    self._process_status_changed_as_captain(current_status, new_status)

        return new_status

    class Meta(ReadOnlyApplicationSerializer.Meta):
        read_only_fields = (
            'created',
            'status',
            'team',
            'player',
            'position',
        )


class MembershipSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='teammember-detail')
    team = serializers.PrimaryKeyRelatedField(read_only=True)
    player = serializers.PrimaryKeyRelatedField(read_only=True)
    position = serializers.PrimaryKeyRelatedField(read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'team',
            'player',
            'player__user',
            'position',
        )
        return queryset

    class Meta:
        model = TeamMember
        fields = (
            'id',
            'created',
            'updated',
            'team',
            'player',
            'position',
            'url',
        )
        read_only_fields = (
            'created',
        )


class EditMembershipAsCaptainSerializer(MembershipSerializer):
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all())

    class Meta(MembershipSerializer.Meta):
        read_only_fields = (
            'created',
            'updated',
            'team',
            'player',
            'url',
        )


class EmailPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailPreference
        fields = (
            'id',
            'created',
            'updated',
            'tag',
            'receive',
        )
        readonly_fields = (
            'created',
            'updated',
            'tag',
        )
        extra_kwargs = {
            "id": {
                "read_only": False
            }
        }


class UserEmailPreferencesSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='useremailpreferences-detail')
    email_preferences = EmailPreferenceSerializer(many=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'user',
        ).prefetch_related(
            'email_preferences',
        )
        return queryset

    def update(self, instance, validated_data):
        email_preferences = validated_data.pop('email_preferences')

        for preference in email_preferences:
            preference_id = preference.get('id')
            preference_receive = preference.get('receive')
            if None in (preference_id, preference_receive):
                raise serializers.ValidationError('Receive email preference without ID or new value.')

            try:
                preference_instance = instance.email_preferences.get(pk=preference_id)
            except EmailPreference.DoesNotExist:
                raise serializers.ValidationError('Received invalid email preference ID.')
            else:
                if preference_receive != preference_instance.receive:
                    preference_instance.receive = preference_receive
                    preference_instance.save()

        return UserEmailPreferences.objects.get(pk=instance.pk)

    class Meta:
        model = UserEmailPreferences
        fields = (
            'id',
            'created',
            'updated',
            'url',
            'user',
            'email_preferences',
        )
        readonly_fields = (
            'id',
            'created',
            'updated',
            'url',
            'user',
        )
