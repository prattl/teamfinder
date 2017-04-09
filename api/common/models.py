from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
import uuid


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class CreatableModel(models.Model):
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True


class UpdateableModel(models.Model):
    updated = models.DateTimeField(null=True, blank=True, editable=False)

    def save(self, *args, **kwargs):
        if self.pk:
            self.updated = timezone.now()
        return super(UpdateableModel, self).save(*args, **kwargs)

    class Meta:
        abstract = True


class AbstractBaseModel(CreatableModel, UpdateableModel, UUIDModel):
    class Meta:
        abstract = True


class SkillBracket(UUIDModel):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ['name']

    def __repr__(self):
        return "<{}: {}>".format(type(self).__name__, self.name)

    def __str__(self):
        return self.name


class Region(UUIDModel):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ['name']

    def __repr__(self):
        return "<{}: {}>".format(type(self).__name__, self.name)

    def __str__(self):
        return self.name


class PositionQuerySet(models.QuerySet):
    def primary(self):
        return self.filter(secondary=False)

    def secondary(self):
        return self.filter(secondary=True)


class Position(UUIDModel):
    name = models.CharField(max_length=255)
    secondary = models.BooleanField(default=False,
                                    help_text='Designates whether this position is only useful in the context of a '
                                              'team member, but not a Team or a Player alone (e.g. Coach or Standin).')
    objects = PositionQuerySet.as_manager()

    class Meta:
        ordering = ['name']

    def __repr__(self):
        return "<{}: {}{}>".format(type(self).__name__, self.name,
                                   ' (secondary)' if self.secondary else '')

    def __str__(self):
        return self.name


class Status:
    NONE = 0
    PENDING = 1
    ACCEPTED = 2
    REJECTED = 3
    EXPIRED = 4
    WITHDRAWN = 5
    CHOICES = (
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
        (EXPIRED, 'Expired'),
        (WITHDRAWN, 'Withdrawn'),
    )


class JoinableAction(AbstractBaseModel):
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE)
    player = models.ForeignKey('players.Player', on_delete=models.CASCADE)
    position = models.ForeignKey(Position, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.IntegerField('Status', choices=Status.CHOICES, default=Status.PENDING)

    def _get_previous_status_history(self):
        raise NotImplementedError('_get_previous_status_history must be implemented.')

    def _create_status_history(self):
        raise NotImplementedError('_create_status_history must be implemented.')

    def _capture_status_history(self):
        previous_status_history = self._get_previous_status_history()
        previous_status = previous_status_history.status if previous_status_history else Status.NONE
        if previous_status != self.status:
            self._create_status_history()

    def save(self, *args, **kwargs):
        super(JoinableAction, self).save(*args, **kwargs)
        self._capture_status_history()

    class Meta:
        abstract = True


class JoinableStatusHistory(AbstractBaseModel):
    status = models.IntegerField('Status', choices=Status.CHOICES)

    class Meta:
        abstract = True
        ordering = ('-created', )


class ApplicationStatusHistoryManager(models.Manager):
    def create_from_application(self, application):
        assert type(application) is Application
        return ApplicationStatusHistory.objects.create(
            application=application,
            status=application.status
        )


class ApplicationStatusHistory(JoinableStatusHistory):
    application = models.ForeignKey('common.Application', on_delete=models.CASCADE)

    objects = ApplicationStatusHistoryManager()


class Application(JoinableAction):
    status_history_class = ApplicationStatusHistory

    def _get_previous_status_history(self):
        return self.applicationstatushistory_set.first()

    def _create_status_history(self):
        ApplicationStatusHistory.objects.create_from_application(self)

    def save(self, *args, **kwargs):
        try:
            previous_self = Application.objects.get(pk=self.pk)
        except Application.DoesNotExist:
            previous_status = None
        else:
            previous_status = previous_self.status
        super(Application, self).save(*args, **kwargs)
        if self.status == Status.ACCEPTED and previous_status != Status.ACCEPTED:
            TeamMember.objects.create(player=self.player, team=self.team, position=self.position)


class InvitationStatusHistoryManager(models.Manager):

    def create_from_invitation(self, invitation):
        assert type(invitation) is Invitation
        return InvitationStatusHistory.objects.create(
            invitation=invitation,
            status=invitation.status
        )


class InvitationStatusHistory(JoinableStatusHistory):
    invitation = models.ForeignKey('common.Invitation', on_delete=models.CASCADE)

    objects = InvitationStatusHistoryManager()


class Invitation(JoinableAction):
    created_by = models.ForeignKey('players.Player', on_delete=models.CASCADE,
                                   related_name='invitations_created')

    def _get_previous_status_history(self):
        return self.invitationstatushistory_set.first()

    def _create_status_history(self):
        InvitationStatusHistory.objects.create_from_invitation(self)

    def save(self, *args, **kwargs):
        try:
            previous_self = Invitation.objects.get(pk=self.pk)
        except Invitation.DoesNotExist:
            previous_status = None
        else:
            previous_status = previous_self.status
        super(Invitation, self).save(*args, **kwargs)
        if self.status == Status.ACCEPTED and previous_status != Status.ACCEPTED:
            TeamMember.objects.create(player=self.player, team=self.team, position=self.position)


class TeamMemberHistoryManager(models.Manager):
    def create_from_team_member(self, team_member, player_id):
        assert type(team_member) is TeamMember
        reason = None
        if player_id == team_member.player_id:
            reason = TeamMemberHistory.REASON_LEFT
        elif player_id == team_member.team.captain_id:
            reason = TeamMemberHistory.REASON_REMOVED
        return TeamMemberHistory.objects.create(
            started=team_member.created,
            ended=timezone.now(),
            team=team_member.team,
            player=team_member.player,
            position=team_member.position,
            reason=reason,
        )


class TeamMemberHistory(AbstractBaseModel):
    REASON_LEFT = 1
    REASON_REMOVED = 2
    REASON_CHOICES = (
        (REASON_LEFT, 'Left'),
        (REASON_REMOVED, 'Removed'),
    )
    started = models.DateTimeField('Started')
    ended = models.DateTimeField('Ended')
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE)
    player = models.ForeignKey('players.Player', on_delete=models.CASCADE)
    position = models.ForeignKey(Position, null=True, blank=True, on_delete=models.SET_NULL)
    reason = models.IntegerField('Reason', choices=REASON_CHOICES, null=True, help_text='Reason for leaving the team')

    objects = TeamMemberHistoryManager()


class TeamMember(AbstractBaseModel):
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE)
    player = models.ForeignKey('players.Player', on_delete=models.CASCADE)
    position = models.ForeignKey(Position, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ('team', 'player', )

    def delete(self, player_id=None, *args, **kwargs):
        # TODO: Is this the best way to inject the "reason" field?
        TeamMemberHistory.objects.create_from_team_member(self, player_id)
        return super(TeamMember, self).delete(*args, **kwargs)

    def __repr__(self):
        return "<{}: {}, {}, {}>".format(type(self).__name__,
                                         repr(self.team), repr(self.player), repr(self.position))

    def __str__(self):
        return str(self.player)
