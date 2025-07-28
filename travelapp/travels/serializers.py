from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from travels.models import Category, Place, Image, User, Role, Provider, Comment, Rating, Favourite

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

    def create(self, validated_data):
        request = self.context.get('request')
        place = Place.objects.create(**validated_data)

        if request and hasattr(request, 'FILES'):
            for i, file in enumerate(request.FILES.getlist('images')):
                Image.objects.create(
                    place=place,
                    title=f'Ảnh {i + 1}',
                    url_path=file
                )

        return place

    def update(self, instance, validated_data):
        request = self.context.get('request')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if request and hasattr(request, 'FILES'):
            for i, file in enumerate(request.FILES.getlist('images')):
                Image.objects.create(
                    place=instance,
                    title=f'Ảnh {i + 1}',
                    url_path=file
                )

        return instance

    class Meta:
        model = Place
        fields = [
            'id', 'name', 'address',
            'open_hours', 'close_hours', 'ticket_price',
            'province', 'ward', 'category','created_date', 'updated_date'
        ]


class PlaceDetailSerializer(PlaceSerializer):
    images = ImageSerializer(many=True, read_only=True)
    full_address = serializers.SerializerMethodField()

    def get_full_address(self, place):
        address = place.address or ""
        ward = place.ward.name if place.ward else ""
        province = place.province.name if place.province else ""
        return f"{address} {ward} {province}".strip()

    class Meta:
        model = PlaceSerializer.Meta.model
        fields = PlaceSerializer.Meta.fields +  [
            'description', 'images', 'full_address'
        ]


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class UserSerializer(ModelSerializer):

    def create(self, validated_data):
        data = validated_data.copy()

        role = self.context.get("role")
        if role is None:
            raise serializers.ValidationError({"role": "Vai trò chưa được cung cấp."})
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
        fields = ["id", "username", "first_name", "last_name", "email", "password", 'avatar', 'phone']
        extra_kwargs = {
            "password": {'write_only' : True},
            "avatar": {"error_messages":{
                "required": "Vui lòng chọn ảnh đại diện!"
            }}
        }


class ProviderSerializer(ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    full_address = serializers.SerializerMethodField()

    def get_full_address(self, provider):
        address = provider.address or ""
        ward = provider.ward.name if provider.ward else ""
        province = provider.province.name if provider.province else ""
        return f"{address} {ward} {province}".strip()

    class Meta:
        model = Provider
        fields = ['name', 'description', 'avatar', 'user', 'province', 'ward', "full_address" ]
        extra_kwargs = {
            "province" :{
                "error_messages": {
                    "required": "Vui lòng chọn địa chỉ tỉnh/thành phổ!",
                    "blank": "Không được để trống thành phố!"
                }
            },
            "ward": {
                "error_messages": {
                    "required": "Vui lòng chọn địa chỉ phường/xã!",
                    "blank": "Không được để trống phường/xã!"
                }
            }
        }



class CommentSerializer(ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = {
            "id": instance.user.id,
            'username': instance.user.username if instance.user else "",
            "avatar": instance.user.avatar.url if instance.user else ""
        }
        return rep

    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {
            'content':{
                "error_messages":{
                    "required": "Vui lòng nhập nội dung binh luận!"
                }
            },
            'place': {
                "write_only": True
            }
        }


class RatingSerializer(ModelSerializer):

    def to_representation(self, rating):
        rep = super().to_representation(rating)
        rep['user'] = {
            'id': rating.user.id,
            'username': rating.user.username,
            'avatar': rating.user.avatar.url if rating.user.avatar else ""
        }
        rep['place'] ={
            'id': rating.place.id,
            'name': rating.place.name
        }
        return rep

    class Meta:
        model = Rating
        fields = ['id', 'star', 'user', 'place']


class FavouriteSerializer(ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = {
            'id': instance.user.id,
            'username': instance.user.username,
            'avatar': instance.user.avatar.url if instance.user.avatar else ""
        }
        rep['place'] ={
            'id': instance.place.id,
            'name': instance.place.name
        }
        return rep

    class Meta:
        model = Favourite
        fields = ['id', 'is_like', 'user', 'place']