import uuid

from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.sites.models import Site
from django.db import models
from django.template.loader import render_to_string
from django.utils import timezone


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


class EmailMixin:
    @staticmethod
    def create_url(url):
        return '{}://{}/{}'.format(
            'http' if settings.DEBUG else 'https',
            Site.objects.get_current().domain,
            url
        )


class Fixture(UUIDModel):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ['name']
        abstract = True

    def __repr__(self):
        return "<{}: {}>".format(type(self).__name__, self.name)

    def __str__(self):
        return self.name


class SkillBracket(Fixture):
    pass


class Region(Fixture):
    pass


class PositionQuerySet(models.QuerySet):
    def primary(self):
        return self.filter(secondary=False)

    def secondary(self):
        return self.filter(secondary=True)


class Position(Fixture):
    secondary = models.BooleanField(default=False,
                                    help_text='Designates whether this position is only useful in the context of a '
                                              'team member, but not a Team or a Player alone (e.g. Coach or Standin).')
    objects = PositionQuerySet.as_manager()

    def __repr__(self):
        return "<{}: {}{}>".format(type(self).__name__, self.name,
                                   ' (secondary)' if self.secondary else '')


class Interest(Fixture):
    pass


class Language(Fixture):
    pass


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


class EmailTag:
    ALL = 0
    UPDATES = 1
    PLAYER_NOTIFICATIONS = 2
    TEAM_NOTIFICATIONS = 3
    CHOICES = (
        (ALL, 'All'),
        (UPDATES, 'Updates and New Features'),
        (PLAYER_NOTIFICATIONS, 'Player Notifications'),
        (TEAM_NOTIFICATIONS, 'Team Notifications'),
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


class Application(JoinableAction, EmailMixin):
    status_history_class = ApplicationStatusHistory

    def __str__(self):
        return "Application for {} to join {}".format(
            self.player,
            self.team,
        )

    def _get_previous_status_history(self):
        return self.applicationstatushistory_set.first()

    def _create_status_history(self):
        ApplicationStatusHistory.objects.create_from_application(self)

    def save(self, *args, **kwargs):
        try:
            previous_self = Application.objects.get(pk=self.pk)
        except Application.DoesNotExist:
            previous_self = None
            previous_status = None
        else:
            previous_status = previous_self.status

        new_instance = not previous_self

        super(Application, self).save(*args, **kwargs)

        self.process_status_change(previous_status)

        if new_instance:
            self.send_application_created_email()

    def send_application_created_email(self):
        email_body = render_to_string('email/application_created.txt', {
            'username': self.team.captain.user.username,
            'player': self.player.user.username,
            'team': self.team.name,
            'team_link': self.create_url('teams/manage/{}'.format(
                self.team.id
            ))
        })
        self.team.captain.user.email_user(
            'You have a new application for {}'.format(self.team.name), email_body, EmailTag.TEAM_NOTIFICATIONS
        )

    def process_status_change(self, previous_status):
        if self.status == Status.ACCEPTED and previous_status != Status.ACCEPTED:
            self.process_application_accepted()
        elif self.status == Status.REJECTED and previous_status != Status.REJECTED:
            self.process_application_rejected()

    def process_application_accepted(self):
        TeamMember.objects.create(player=self.player, team=self.team, position=self.position)
        self.send_application_accepted_email()

    def send_application_accepted_email(self):
        email_body = render_to_string('email/application_accepted.txt', {
            'username': self.player.user.username,
            'team': self.team.name,
            'team_link': self.create_url('teams/manage/{}'.format(
                self.team.id
            ))
        })
        self.player.user.email_user(
            'Your application has been accepted!', email_body, EmailTag.PLAYER_NOTIFICATIONS
        )

    def process_application_rejected(self):
        self.send_application_rejected_email()

    def send_application_rejected_email(self):
        email_body = render_to_string('email/application_rejected.txt', {
            'username': self.player.user.username,
            'team': self.team.name,
            'team_search_link': self.create_url('teams')
        })
        self.player.user.email_user(
            '☹ Your application was not accepted', email_body, EmailTag.PLAYER_NOTIFICATIONS
        )


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


class Invitation(JoinableAction, EmailMixin):
    created_by = models.ForeignKey('players.Player', on_delete=models.CASCADE,
                                   related_name='invitations_created')

    def __str__(self):
        return "Invitation for {} to join {}".format(
            self.player,
            self.team,
        )

    def _get_previous_status_history(self):
        return self.invitationstatushistory_set.first()

    def _create_status_history(self):
        InvitationStatusHistory.objects.create_from_invitation(self)

    def save(self, *args, **kwargs):
        try:
            previous_self = Invitation.objects.get(pk=self.pk)
        except Invitation.DoesNotExist:
            previous_self = None
            previous_status = None
        else:
            previous_status = previous_self.status

        new_instance = not previous_self

        super(Invitation, self).save(*args, **kwargs)

        self.process_status_change(previous_status)

        if new_instance:
            self.send_invitation_created_email()

    def send_invitation_created_email(self):
        email_body = render_to_string('email/invitation_created.txt', {
            'username': self.player.user.username,
            'captain': self.team.captain.user.username,
            'team': self.team.name,
            'teams_link': self.create_url('teams/manage')
        })
        self.player.user.email_user(
            'You have been invited to join {}!'.format(self.team.name), email_body, EmailTag.PLAYER_NOTIFICATIONS
        )

    def process_status_change(self, previous_status):
        if self.status == Status.ACCEPTED and previous_status != Status.ACCEPTED:
            self.process_invitation_accepted()
        elif self.status == Status.REJECTED and previous_status != Status.REJECTED:
            self.process_invitation_rejected()

    def process_invitation_accepted(self):
        TeamMember.objects.create(player=self.player, team=self.team, position=self.position)
        self.send_invitation_accepted_email()

    def send_invitation_accepted_email(self):
        email_body = render_to_string('email/invitation_accepted.txt', {
            'username': self.team.captain.user.username,
            'player': self.player.user.username,
            'team': self.team.name,
            'invite_date': self.created.strftime('%-d %B %Y'),
            'team_link': self.create_url('teams/manage/{}'.format(self.team.id))
        })
        self.team.captain.user.email_user(
            'Your invitation has been accepted!', email_body, EmailTag.TEAM_NOTIFICATIONS
        )

    def process_invitation_rejected(self):
        self.send_invitation_rejected_email()

    def send_invitation_rejected_email(self):
        email_body = render_to_string('email/invitation_rejected.txt', {
            'username': self.team.captain.user.username,
            'player': self.player.user.username,
            'team': self.team.name,
            'invite_date': self.created.strftime('%-d %B %Y'),
            'player_search_link': self.create_url('players')
        })
        self.team.captain.user.email_user(
            'Your invitation was not accepted', email_body, EmailTag.TEAM_NOTIFICATIONS
        )


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

    def save(self, *args, **kwargs):
        try:
            TeamMember.objects.get(pk=self.pk)
        except TeamMember.DoesNotExist:
            new_member = True
        else:
            new_member = False

        super(TeamMember, self).save(*args, **kwargs)

        if new_member:
            self.team.update_mmr_average()

    def delete(self, player_id=None, *args, **kwargs):
        TeamMemberHistory.objects.create_from_team_member(self, player_id)
        self.team.update_mmr_average()
        return super(TeamMember, self).delete(*args, **kwargs)

    def __repr__(self):
        return "<{}: {}, {}, {}>".format(type(self).__name__,
                                         repr(self.team), repr(self.player), repr(self.position))

    def __str__(self):
        return str(self.player)


class EmailRecord(AbstractBaseModel):
    # TODO: Refactor `to` field to be a related field to TFUser
    to = models.TextField()
    from_address = models.CharField(max_length=256)
    subject = models.CharField(max_length=256)
    text_content = models.TextField()

    def __str__(self):
        return '{} sent to {}'.format(self.subject, self.to)
