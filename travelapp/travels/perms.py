from rest_framework import permissions

class IsAdmin(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.role.name == "admin"


class IsProvider(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        print(request.user.role.name)
        return request.user and request.user.is_provider

class IsOwnerProvider(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_permission(self,view) and request.user==obj.user