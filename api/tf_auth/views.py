from django.contrib.auth import logout
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response


class AccountView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def delete(self, request):
        if request.user.is_authenticated:
            user = request.user
            logout(request)
            user.delete()
            return Response({}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)
