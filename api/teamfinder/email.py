from threading import Thread

from django.core.mail import send_mail

FROM_ADDRESS = "admin@dotateamfinder.com"


def _send_email(subject, text_content, recipient_list):
    send_mail(
        subject, text_content, FROM_ADDRESS, recipient_list
    )


def send_email(subject, text_content, recipient_list):
    Thread(target=_send_email, args=(subject, text_content, recipient_list)).start()
