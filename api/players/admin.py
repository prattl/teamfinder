from django.contrib import admin
from . import models


class PlayerAdmin(admin.ModelAdmin):
    model = models.Player
    fields = ('id', 'created', 'updated', 'username', 'user', 'skill_bracket', 'regions', 'positions', )
    readonly_fields = ('id', 'created', 'updated', )
    list_display = ('get_user_email', 'username', 'skill_bracket', 'get_date_joined', 'created', 'updated', )
    list_filter = ('user__date_joined', 'skill_bracket', 'regions', 'positions', 'created', 'updated', )
    raw_id_fields = ('user', )

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'
    get_user_email.admin_order_field = 'user__email'

    def get_date_joined(self, obj):
        return obj.user.date_joined
    get_date_joined.short_description = 'Date joined'
    get_date_joined.admin_order_field = 'user__date_joined'


admin.site.register(models.Player, PlayerAdmin)
