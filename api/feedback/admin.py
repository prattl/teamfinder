from django import forms
from django.contrib import admin

from feedback.models import Feedback


class FeedbackAdminForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = '__all__'
        widgets = {
            'comments': forms.Textarea(attrs={'cols': 80, 'rows': 5}),
            'user_agent': forms.Textarea(attrs={'cols': 80, 'rows': 5}),
            'redux_state': forms.Textarea(attrs={'cols': 80, 'rows': 20}),
        }


class FeedbackAdmin(admin.ModelAdmin):
    model = Feedback
    form = FeedbackAdminForm
    list_display = (
        'player',
        'get_type',
        'created',
        'comments',
    )
    list_filter = (
        'type',
        'created',
    )
    search_fields = (
        'comments',
        'user_agent',
        'redux_state',
        'player__username',
    )

    def get_type(self, obj):
        return obj.get_type_display()
    get_type.short_description = 'Type'
    get_type.admin_order_field = 'type'


admin.site.register(Feedback, FeedbackAdmin)
