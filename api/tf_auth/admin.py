from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.urls import reverse
from django.utils.html import format_html
from social_django.models import UserSocialAuth

from common.models import EmailTag
from tf_auth.models import TFUser, EmailPreference, UserEmailPreferences


class TFUserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = TFUser
        fields = ('email', )

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(TFUserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = TFUser
        fields = ('email', 'password', 'is_active', 'is_staff')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserSocialAuthAdminInline(admin.TabularInline):
    model = UserSocialAuth
    extra = 0
    show_change_link = True


class TFUserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = TFUserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('steamid', 'username', 'email', 'player', 'is_staff', 'date_joined', 'last_login', )
    list_filter = ('is_staff',)
    fieldsets = (
        (None, {
            'fields': ('steamid', 'username', 'email', 'password', 'date_joined',)
        }),
        ('Player', {
            'fields': ('get_player', )
        }),
        ('Avatars', {
            'fields': ('avatar', 'avatarfull', )
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_superuser', ),
        }),
    )
    readonly_fields = ('date_joined', 'last_login', 'get_player', )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    search_fields = ('email', 'username', 'steamid', )
    ordering = ('email',)
    filter_horizontal = ()
    inlines = (
        UserSocialAuthAdminInline,
    )

    def get_player(self, obj):
        player_url = reverse('admin:players_player_change', args=(obj.player.id, ))
        if player_url:
            return format_html('<a href="{}">Go to Player</a>'.format(player_url))
        return None


class EmailPreferenceAdminInline(admin.TabularInline):
    model = EmailPreference
    extra = 0


class UserEmailPreferencesAdmin(admin.ModelAdmin):
    model = UserEmailPreferences
    list_display = (
        'user', 'get_receive_all', 'get_receive_updates', 'get_receive_team', 'get_receive_player'
    )
    readonly_fields = ('user', )
    inlines = (EmailPreferenceAdminInline,)

    def get_receive_all(self, obj):
        return obj.email_preferences.filter(tag=EmailTag.ALL, receive=True).exists()
    get_receive_all.short_description = 'Receive All'
    get_receive_all.boolean = True

    def get_receive_updates(self, obj):
        return obj.email_preferences.filter(tag=EmailTag.UPDATES, receive=True).exists()
    get_receive_updates.short_description = 'Receive Updates'
    get_receive_updates.boolean = True

    def get_receive_team(self, obj):
        return obj.email_preferences.filter(tag=EmailTag.TEAM_NOTIFICATIONS, receive=True).exists()
    get_receive_team.short_description = 'Receive Team'
    get_receive_team.boolean = True

    def get_receive_player(self, obj):
        return obj.email_preferences.filter(tag=EmailTag.PLAYER_NOTIFICATIONS, receive=True).exists()
    get_receive_player.short_description = 'Receive Player'
    get_receive_player.boolean = True



# Now register the new UserAdmin...
admin.site.register(TFUser, TFUserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)
admin.site.register(UserEmailPreferences, UserEmailPreferencesAdmin)

