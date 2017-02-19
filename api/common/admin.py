from django.contrib import admin
from . import models


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


class SkillBracketAdmin(admin.ModelAdmin):
    model = models.SkillBracket
    readonly_fields = ('id', )
    fields = ('id', 'name', )


class TeamMemberAdmin(admin.ModelAdmin):
    model = models.TeamMember
    fields = ('id', 'created', 'updated', 'team', 'player', 'position', )
    readonly_fields = ('id', 'created', 'updated', )
    list_display = ('team', 'player', 'position', 'created', 'updated', )
    list_filter = ('position', 'created', 'updated', )
    raw_id_fields = ('team', 'player', )
    search_fields = ('name', 'player__username', )


admin.site.register(models.Region, RegionAdmin)
admin.site.register(models.Position, PositionAdmin)
admin.site.register(models.SkillBracket, SkillBracketAdmin)
admin.site.register(models.TeamMember, TeamMemberAdmin)
