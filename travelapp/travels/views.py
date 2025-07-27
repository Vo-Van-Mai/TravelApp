from xmlrpc.client import Fault

from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from travels import serializers, perms
from travels.panigation import PlacePagination, CommentPagination
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, permission_classes
from travels.models import Category, Place, Image, Role, User, Provider, Comment

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Category.objects.filter(active=True)
    serializer_class =serializers.CategorySerializer

    def get_permissions(self):
        if self.request.method.__eq__("POST"):
            return [perms.IsAdmin()]
        else:
            return [permissions.AllowAny()]


class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.filter(active=True)
    serializer_class = serializers.PlaceSerializer
    parser_classes = [MultiPartParser]
    pagination_class = PlacePagination

    def get_permissions(self):
        if self.action == "get_comment" and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        if self.action in ["list", "retrieve"] or (self.action == "get_comment" and self.request.method=="GET"):
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), perms.IsAdmin()]


    def get_queryset(self):
        query = self.queryset

        province = self.request.query_params.get('province')
        ward = self.request.query_params.get('ward')
        name = self.request.query_params.get("name")
        if province:
            query = query.filter(province=province)

        if ward:
            query = query.filter(ward=ward)

        if name:
            query = query.filter(name__icontains=name)
        return query


    @action(methods=['get', 'post'], detail=True, url_path="get-comment")
    def get_comment(self, request, pk):
        if request.method.__eq__("POST"):
            c = serializers.CommentSerializer(data={
                "content": request.data.get('content'),
                "user" : request.user.pk,
                "place": pk
            })
            c.is_valid(raise_exception=True)
            c.save()
            return Response(c.data, status=status.HTTP_201_CREATED)
        else:
            comment = self.get_object().comments.select_related('user').filter(active=True)
            p = CommentPagination()
            page = p.paginate_queryset(comment, self.request)
            if page:
                s = serializers.CommentSerializer(comment, many=True)
                return p.get_paginated_response(s.data)
            else:
                return Response(serializers.CommentSerializer(comment, many=True).data, status=status.HTTP_200_OK)


class RoleViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Role.objects.filter(active=True)
    serializer_class = serializers.RoleSerializer
    permission_classes = [permissions.IsAuthenticated, perms.IsAdmin]


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser]

    def get_permissions(self):
        if self.action.__eq__("register"):
            return [permissions.AllowAny()]  # Mọi người đều đăng ký được

        if self.action in[ 'list', 'retrieve']:
            return [permissions.IsAuthenticated(), perms.IsAdmin()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        query = self.queryset
        role = self.request.query_params.get('role')
        if role:
            query = query.filter(role=role)

        return query

    @action(methods=['post'], url_path="register", detail=False)
    def register(self, request):
        role_id = request.query_params.get("role_id")
        try:
            role = Role.objects.get(pk=role_id)
        except Role.DoesNotExist:
            return Response({"message": "Không tìm thấy vai trò hợp lệ!"}, status=400)

        if role.name.lower().__eq__('admin'):
            return Response({"message": "đăng kí vai trò không hợp lệ!"}, status=400)

        serializer = serializers.UserSerializer(data=request.data, context={"role": role})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Đăng ký thành công"}, status=status.HTTP_201_CREATED)


    @action(methods=['get', 'patch'], url_path="current-user", detail=False, permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        if request.method.__eq__("PATCH"):
            user = request.user

            for key in request.data:
                if key in ["first_name", "last_name", "username", "email", "avatar"]:
                    setattr(user, key, request.data[key])
                elif key.__eq__("password"):
                    user.set_password(request.data["password"])

            user.save()
            return Response(serializers.UserSerializer(user).data, status=status.HTTP_200_OK)
        else:
            return Response(serializers.UserSerializer(request.user).data, status=status.HTTP_200_OK)


    @action(methods=['patch'], url_path="verified-provider", detail=True)
    def verified_provider(self, request, pk=None):
        user = self.get_object()
        user.is_provider = True
        user.save()
        return Response({"message": "Xác thực thành công!"}, status=status.HTTP_200_OK)


    @action(methods=['patch'], url_path="cancel-provider", detail=True)
    def cancel_provider(self, request, pk=None):
        user = self.get_object()
        user.is_provider = False
        user.save()
        return Response({"message": "Hủy quyền thành công!"}, status=status.HTTP_200_OK)


class ProviderViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Provider.objects.filter(active=True)
    serializer_class = serializers.ProviderSerializer
    parser_classes = [MultiPartParser]

    def get_permissions(self):
        if self.request.method.__eq__("POST"):
            return [perms.IsProvider()]
        if self.request.method.__eq__("PATCH") and self.action.__eq__("update_provider"):
            return [perms.IsOwnerProvider()]
        return [perms.IsAdmin(), perms.IsProvider()]

    def get_queryset(self):
        query = self.queryset
        return query.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, 'provider'):
            return Response({"message": "Người dùng đã tạo Provider cho mình!"}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        try:
            return Provider.objects.get(pk=self.kwargs["pk"], user=self.request.user)
        except Provider.DoesNotExist:
            raise NotFound("Không tìm thấy hồ sơ Provider của bạn.")


    @action(methods=['patch'], url_path="update-provider", detail=True)
    def update_provider(self, request, pk):
        provider = self.get_object()

        for key in request.data:
            if key in ["name", 'province', 'ward', "description"]:
                setattr(provider, key, request.data[key])

        provider.save()
        return Response(serializers.ProviderSerializer(provider).data, status=status.HTTP_200_OK)


# class CommentViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Comment.objects.filter(active=True)
#     serializer_class = serializers.CommentSerializer



