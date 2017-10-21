from django.forms import ModelForm
from django.forms.widgets import Textarea
from .models import Team


class TeamAdminForm(ModelForm):
    class Meta:
        model = Team
        widgets = {
            "bio": Textarea(),
        }
        fields = "__all__"
