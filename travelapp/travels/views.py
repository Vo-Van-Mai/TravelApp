from django.db.models.functions import TruncDay
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from travels import serializers, perms
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, permission_classes
from travels.models import Category, Place, Image, Role, User

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.filter(active=True)
    serializer_class =serializers.CategorySerializer


class PlaceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Place.objects.filter(active=True)
    serializer_class = serializers.PlaceSerializer


class RoleViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Role.objects.filter(active=True)
    serializer_class = serializers.RoleSerializer
    permission_classes = [permissions.IsAuthenticated, perms.IsAdmin]


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser,]

    def get_permissions(self):
        if self.action in ['register_traveler', 'register_provider']:
            return [permissions.AllowAny()]  # Mọi người đều đăng ký được

        if self.action == 'list':
            return [permissions.IsAuthenticated(), perms.IsAdmin()]

        return [permissions.IsAuthenticated()]

    @action(methods=['post'], url_path="register-traveler", detail=False)
    def register_traveler(self, request):
        serializer = serializers.UserSerializer(data=request.data, context={"role_name": "traveler"})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Đăng ký Traveler thành công"}, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path="register-provider", detail=False)
    def register_provider(self, request):
        serializer = serializers.UserSerializer(data=request.data, context={"role_name": "provider"})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Đăng ký Provider thành công"}, status=status.HTTP_201_CREATED)


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




