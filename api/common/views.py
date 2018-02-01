import subprocess
from django.conf import settings
from django.contrib.sites.models import Site
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token


@csrf_exempt
def deploy(request):
    deploy_secret_key = request.POST.get('DEPLOY_SECRET_KEY')
    # branch = request.POST.get('BRANCH')
    commit = request.POST.get('COMMIT')

    if deploy_secret_key != settings.SECRET_KEY:
        return HttpResponseBadRequest('Incorrect key.')

    subprocess.Popen(['scripts/deploy.sh', commit], stdout=subprocess.PIPE)
    return JsonResponse({'result': 'deploy started'})


def social_redirect(request):
    token, _ = Token.objects.get_or_create(user=request.user)
    return_url = '{protocol}://{domain}/finish-steam/{token}'.format(
        protocol='http' if settings.DEBUG else 'https',
        domain=Site.objects.get_current().domain,
        token=token.key
    )
    return redirect(return_url)
