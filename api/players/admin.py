from django.contrib import admin

from tf_auth.admin import EmailPreferenceAdminInline
from . import models
from common.admin import ApplicationAdminInline, PlayerInvitationAdminInline, TeamMemberAdminInline
from teams.admin import TeamAdminInline


class TeamsCaptainOfInline(TeamAdminInline):
    fk_name = 'captain'
    verbose_name = 'Team Captain Of'
    verbose_name_plural = 'Teams Captain Of'


class PlayerAdmin(admin.ModelAdmin):
    model = models.Player
    fieldsets = (
        (None, {
            'fields': ('id', 'get_username', 'user', 'created', 'updated', ),
        }),
        ('Metadata', {
            'fields': ('deprecated_skill_bracket', 'regions', 'positions', ),
        }),
        ('MMR', {
            'fields': ('mmr', 'mmr_estimate', 'mmr_last_updated', ),
        }),
    )
    readonly_fields = ('id', 'created', 'updated', 'get_username', )
    list_display = ('get_user_email', 'get_username', 'deprecated_skill_bracket', 'mmr', 'mmr_estimate',
                    'get_date_joined', 'created', 'updated', )
    list_filter = ('user__date_joined', 'deprecated_skill_bracket', 'regions', 'positions', 'created', 'updated', )
    search_fields = ('user__username', )
    raw_id_fields = ('user', )
    inlines = (
        TeamsCaptainOfInline,
        TeamMemberAdminInline,
        ApplicationAdminInline,
        PlayerInvitationAdminInline,
    )

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
    get_username.admin_order_field = 'user__username'

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'
    get_user_email.admin_order_field = 'user__email'

    def get_date_joined(self, obj):
        return obj.user.date_joined
    get_date_joined.short_description = 'Date joined'
    get_date_joined.admin_order_field = 'user__date_joined'


admin.site.register(models.Player, PlayerAdmin)
