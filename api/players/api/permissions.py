from rest_framework import permissions


class IsStaffOrTargetPlayer(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ['POST', 'PATCH']:
            return True
        else:
            ret = request.method in permissions.SAFE_METHODS or (request.user and request.user.is_staff)
            return ret

    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'player'):
            return (request.user and request.user.is_staff) or (request.user and obj == request.user.player)
        else:
            return request.user and request.user.is_staff
