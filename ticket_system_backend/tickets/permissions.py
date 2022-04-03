from rest_framework import permissions

class RestPermissions(permissions.BasePermission):
    message = "This API is readonly for authenticated users"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS \
            and (request.user and request.user.is_authenticated):
            return True
        return False


class IsRegularUser(permissions.BasePermission):
    message = "This API is only for regular users"

    def has_permission(self, request, view):
        user = request.user
        return user and user.is_authenticated and not user.is_staff