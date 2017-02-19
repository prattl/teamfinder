from rest_framework import permissions


class IsStaffOrTargetPlayer(permissions.IsAuthenticatedOrReadOnly):
    """Only allow unsafe methods if the user is staff or the user is editing their own player."""
    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or (
            request.user.is_authenticated()
        )

    def has_object_permission(self, request, view, obj):
        # TODO: Support for DELETE to un-register users.
        if request.method in ('DELETE', 'POST', ):
            return False
        return (
            request.method in permissions.SAFE_METHODS or (
                request.user.is_authenticated() and (
                    request.user.is_staff or obj == getattr(request.user, 'player')
                )
            )
        )


class IsStaffOrTeamCaptain(permissions.BasePermission):
    message = "Only the team captain can edit a team."

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.user.is_staff:
            return True
        else:
            if hasattr(request.user, 'player'):
                return request.user.player.pk == obj.captain.pk
        return False


class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


class MembershipPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ('PUT', 'PATCH', ):
            # Only team captains can edit team members
            return request.user.player.teams_captain_of.exists()
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        current_player = request.user.player
        if request.method == 'DELETE':
            # Only the member's team captain, the member's player, or staff users can delete memberships
            return current_player == obj.player or current_player.id == obj.team.captain_id or request.user.is_staff
        # Only the member's team captain or staff users can make changes
        return current_player.id == obj.team.captain_id or request.user.is_staff


class JoinableActionPermissions(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        # Only the applicant/invitee, team captain, or staff users can access
        current_player = request.user.player
        return current_player == obj.player or current_player.id == obj.team.captain_id or request.user.is_staff
