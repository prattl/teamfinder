from common.models import AbstractBaseModel, EmailTag, UUIDModel
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from players.models import Player
from teamfinder.email import send_email


class TFUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        Player.objects.create(user=user)
        UserEmailPreferences.objects.create(user=user)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class TFUser(AbstractBaseUser, PermissionsMixin, UUIDModel):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Email and password are required. Other fields are optional.
    """
    email = models.EmailField(_('email address'), unique=True,
                              error_messages={'unique': _('User with this %(field_label)s already exists.'), })
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = TFUserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def email_user(self, subject, body, tag):
        if self.should_send_email(tag):
            send_email(subject, body, [self.email])

    def should_send_email(self, tag):
        return self.user_email_preferences.should_send_email(tag)


class EmailPreference(AbstractBaseModel):
    tag = models.IntegerField(choices=EmailTag.CHOICES)
    receive = models.BooleanField(default=True)
    user_email_preferences = models.ForeignKey('tf_auth.UserEmailPreferences', related_name='email_preferences')

    class Meta:
        unique_together = (
            ('tag', 'user_email_preferences'),
        )


class UserEmailPreferences(AbstractBaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='user_email_preferences')

    def save(self, *args, **kwargs):
        new_instance = not self.pk
        super(UserEmailPreferences, self).save(*args, **kwargs)
        if new_instance:
            self.create_default_preferences()

    def create_default_preferences(self):
        for (option, _) in EmailTag.CHOICES:
            EmailPreference.objects.create(tag=option, user_email_preferences=self)

    def should_send_email(self, tag):
        should_send_any = not self.email_preferences.filter(tag=EmailTag.ALL, receive=False).exists()
        return should_send_any and self.email_preferences.filter(tag=tag, receive=True).exists()
