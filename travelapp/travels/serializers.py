from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from travels.models import Category, Place, Image, User, Role

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ImageSerializer(ModelSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['url_path'] = instance.url_path.url if instance.url_path else ""
        return data

    class Meta:
        model = Image
        fields = ['id', 'url_path']


class PlaceSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    full_address = serializers.SerializerMethodField()

    def get_full_address(self, place):
        address = place.address or ""
        ward = place.ward.name if place.ward else ""
        district = place.district.name if place.district else ""
        province = place.province.name if place.province else ""
        return f"{address} {ward} {district} {province}".strip()

    class Meta:
        model = Place
        fields = ['id', 'name', 'created_date', 'updated_date',"images", "full_address"]


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class UserSerializer(ModelSerializer):

    def create(self, validated_data):
        data = validated_data.copy()

        role_name = self.context.get("role_name", "traveler")
        try:
            role = Role.objects.get(name__iexact=role_name)
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role": "Vai trò không tồn tại!"})

        user = User(**data)
        user.set_password(data['password'])
        user.role = role
        user.save()
        return user

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url if instance.avatar else ""
        rep['role'] = instance.role.name if instance.role else None
        return rep

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "password", 'avatar']
        extra_kwargs = {
            "password": {'write_only' : True},
            "avatar": {"error_messages":{
                "required": "Vui lòng chọn ảnh đại diện!"
            }}
        }
