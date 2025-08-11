from pyexpat.errors import messages
from rest_framework import permissions

class IsAdmin(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.role.name == "admin"


class IsProvider(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        print(request.user.role.name)
        return  super().has_permission(request, view) and request.user.is_provider

class IsOwnerProvider(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_permission(request,view) and request.user==obj.user


class IsOwnerComment(permissions.IsAuthenticated):
    message = "Bạn không có quyền với bình luận này."

    def has_object_permission(self, request, view, comment):
        # Nếu không phải chủ sở hữu
        if request.user != comment.user:
            if request.method == "PATCH":
                self.message = "Bạn chỉ có thể cập nhật bình luận của chính mình!"
            elif request.method == "DELETE":
                self.message = "Bạn không thể xóa bình luận của người khác!"
            else:
                self.message = "Bạn không có quyền với hành động này."
            return False
        return True


class IsOwnerRating(permissions.IsAuthenticated):
    message = "Bạn không có quyền với đánh giá này."

    def has_object_permission(self, request, view, rating):
        # Nếu không phải chủ sở hữu
        if request.user != rating.user:
            if request.method == "PATCH":
                self.message = "Bạn chỉ có thể cập nhật đánh giá của chính mình!"
            elif request.method == "DELETE":
                self.message = "Bạn không thể xóa đánh giá của người khác!"
            else:
                self.message = "Bạn không có quyền với hành động này."
            return False
        return True

class IsOwnerTour(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.user.id != obj.provider_id:
            self.messages="Bạn không phải là chủ sở hữu tour này!"
            return False
        else:
            return True

# class IsOwnerFavourite(permissions.IsAuthenticated):
#     def has_object_permission(self, request, view, obj):
#         # Nếu không phải chủ sở hữu
#         if request.user != obj.user:
#             self.message = "Bạn không có quyền với hành động này."
#             return False
#         return True



