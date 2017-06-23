from django.contrib import admin
from . import models


class EmailRecordAdmin(admin.ModelAdmin):
    model = models.EmailRecord
    list_display = ('subject', 'to', 'from_address', 'created', 'updated', )
    search_fields = ('subject', 'to', 'from_address', 'text_content', )


class RegionAdmin(admin.ModelAdmin):
    model = models.Region
    fields = ('id', 'name', )
    readonly_fields = ('id', )


class PositionAdmin(admin.ModelAdmin):
    model = models.Position
    fields = ('id', 'name', 'secondary', )
    readonly_fields = ('id', )
    list_display = ('name', 'secondary', )
    list_filter = ('secondary', )


class TeamMemberAdminInline(admin.TabularInline):
    model = models.TeamMember
    fields = ('team', 'player', 'position', 'created', 'updated', )
    readonly_fields = fields
    extra = 0
    show_change_link = True


class TeamMemberAdmin(admin.ModelAdmin):
    model = models.TeamMember
    fields = ('id', 'created', 'updated', 'team', 'player', 'position', )
    readonly_fields = ('id', 'created', 'updated', )
    list_display = ('team', 'player', 'position', 'created', 'updated', )
    list_filter = ('position', 'created', 'updated', )
    raw_id_fields = ('team', 'player', )
    search_fields = ('name', 'player__username', )


class JoinableActionAdminInline(admin.TabularInline):
    fields = ('player', 'team', 'position', 'status', 'updated', 'created', )
    readonly_fields = fields
    extra = 0
    show_change_link = True


class ApplicationAdminInline(JoinableActionAdminInline):
    model = models.Application


class InvitationAdminInline(JoinableActionAdminInline):
    model = models.Invitation


class PlayerInvitationAdminInline(InvitationAdminInline):
    fk_name = 'player'


class TeamInvitationAdminInline(InvitationAdminInline):
    fk_name = 'team'


admin.site.register(models.Application)
admin.site.register(models.EmailRecord, EmailRecordAdmin)
admin.site.register(models.Invitation)
admin.site.register(models.Region, RegionAdmin)
admin.site.register(models.Position, PositionAdmin)
admin.site.register(models.TeamMember, TeamMemberAdmin)
