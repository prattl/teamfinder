from django.contrib import admin
from . import models


class TeamAdmin(admin.ModelAdmin):
    model = models.Team
    fields = ('id', 'created', 'updated', 'name', 'players', 'skill_bracket', 'regions', 'available_positions', 'captain', 'creator', )
    readonly_fields = ('id', 'players', 'created', 'updated', )
    list_display = ('name', 'captain', 'creator', 'skill_bracket', 'created', 'updated', )
    list_filter = ('skill_bracket', 'regions', 'available_positions', 'created', 'updated', )

    def get_date_joined(self, obj):
        return obj.user.date_joined
    get_date_joined.short_description = 'Date joined'
    get_date_joined.admin_order_field = 'user__date_joined'


admin.site.register(models.Team, TeamAdmin)
