from django.contrib import admin

from common.admin import ApplicationAdminInline, TeamInvitationAdminInline, TeamMemberAdminInline
from teams.admin_forms import TeamAdminForm
from teams.models import Team


class TeamAdminInline(admin.TabularInline):
    model = Team
    fields = ('name', 'players', 'regions', 'available_positions', 'interests', 'languages', 'captain', 'created', )
    readonly_fields = fields
    extra = 0
    show_change_link = True


class TeamAdmin(admin.ModelAdmin):
    model = Team
    form = TeamAdminForm
    readonly_fields = ('id', 'players', 'created', 'updated', )
    list_display = ('name', 'captain', 'creator', 'created', 'updated', )
    list_filter = ('regions', 'available_positions', 'interests', 'languages', 'created', 'updated', )
    search_fields = ('name', 'bio', 'captain__username', 'creator__username', )
    ordering = ('-created', )
    inlines = (
        TeamMemberAdminInline,
        ApplicationAdminInline,
        TeamInvitationAdminInline,
    )

    def get_date_joined(self, obj):
        return obj.user.date_joined
    get_date_joined.short_description = 'Date joined'
    get_date_joined.admin_order_field = 'user__date_joined'


admin.site.register(Team, TeamAdmin)
