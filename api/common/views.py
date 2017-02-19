import subprocess
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def deploy(request):
    deploy_secret_key = request.POST.get('DEPLOY_SECRET_KEY')
    # branch = request.POST.get('BRANCH')
    commit = request.POST.get('COMMIT')

    if deploy_secret_key != settings.SECRET_KEY:
        return HttpResponseBadRequest('Incorrect key.')

    subprocess.Popen(['scripts/deploy.sh', commit], stdout=subprocess.PIPE)
    return JsonResponse({'result': 'deploy started'})
