from django.contrib.auth import get_user_model
from django.utils import timezone
from re import sub
from rest_framework.authtoken.models import Token
import random

User = get_user_model()


class LastLoginMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # should_crash = random.randInt(3)
        # print('should_crash', should_crash)
        # if should_crash == 3:
        raise Exception('Test error')

        header_token = request.META.get('HTTP_AUTHORIZATION', None)

        if header_token:
            try:
                token = sub('Token ', '', header_token)
                token_obj = Token.objects.get(key=token)
                request.user = token_obj.user
            except Token.DoesNotExist:
                pass

        if request.user.is_authenticated:
            User.objects.filter(pk=request.user.pk).update(last_login=timezone.now())
        response = self.get_response(request)

        return response
