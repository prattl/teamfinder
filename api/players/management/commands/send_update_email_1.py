from django.core.management.base import BaseCommand, CommandError
from django.template.loader import render_to_string

from common.models import EmailTag
from tf_auth.models import TFUser


class Command(BaseCommand):
    def handle(self, *args, **options):
        for user in TFUser.objects.all():
            email_body = render_to_string('email/updates/update_1.txt', {
                'username': user.username if user.username else user.email,
            })
            user.email_user(
                'Update from dotateamfinder.com', email_body, EmailTag.UPDATES
            )

        self.stdout.write(self.style.SUCCESS('Finished sending update email 1.'))
