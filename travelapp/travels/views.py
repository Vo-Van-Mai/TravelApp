import requests
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response

from . import serializers, perms
from .panigation import PlacePagination, CommentPagination, RatingPagination, UserPagination
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, permission_classes
from .models import Category, Place, Image, Role, User, Provider, Comment, Rating, Favourite, Province, Payment, \
    TourPlace, Ward, Tour
from .serializers import ProvinceSerializer, PlaceDetailSerializer


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Category.objects.filter(active=True)
    serializer_class =serializers.CategorySerializer

    def get_permissions(self):
        if self.request.method.__eq__("POST"):
            return [perms.IsAdmin()]
        else:
            return [permissions.AllowAny()]


class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.filter(active=True).order_by('-id')
    serializer_class = serializers.PlaceDetailSerializer
    parser_classes = [MultiPartParser, JSONParser]
    pagination_class = PlacePagination

    def get_permissions(self):
        if self.action in ['get_comment', 'get_rating', 'get_favourite'] and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        if self.action in ["list", "retrieve", "get_star_average"] or (self.action in ['get_comment', 'get_rating', 'get_favourite'] and self.request.method=="GET"):
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), perms.IsAdmin()]

    def list(self, request, *args, **kwargs):
        if request.query_params.get('all') == 'true':
            self.pagination_class = None
            self.serializer_class= serializers.PlaceItemSerializer
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.longitude or not instance.latitude:
            url = "https://nominatim.openstreetmap.org/search"
            params = {"q": instance.name, "format": "json"}
            response = requests.get(url, params=params,
                                    headers={"User-Agent": "travelapp (contact: maivo0902@gmail.com)"})

            if response.status_code == 200:  # kiểm tra request thành công
                data = response.json()
                if data:
                    instance.latitude = data[0]["lat"]
                    instance.longitude = data[0]["lon"]
                    instance.save(update_fields=["latitude", "longitude"])  # save để lưu DB
                    print("lat", data[0]["lat"])
                    print("lon", data[0]["lon"])

        serializer = PlaceDetailSerializer(instance)
        return Response(serializer.data)



    def get_queryset(self):
        query = self.queryset

        province = self.request.query_params.get('province')
        ward = self.request.query_params.get('ward')
        name = self.request.query_params.get("name")
        cate = self.request.query_params.get("cate")
        if province:
            query = query.filter(province=province)

        if ward:
            query = query.filter(ward=ward)

        if name:
            query = query.filter(name__icontains=name)

        if cate:
            query = query.filter(category_id=cate)
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
            comment = self.get_object().comments.select_related('user').filter(active=True).order_by('-id')
            p = CommentPagination()
            page = p.paginate_queryset(comment, self.request)
            if page:
                s = serializers.CommentSerializer(page, many=True)
                return p.get_paginated_response(s.data)
            else:
                return Response(serializers.CommentSerializer(comment, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get', 'post'], url_path="get-rating", detail=True)
    def get_rating(self, request, pk):
        if request.method.__eq__("POST"):
            star = request.data.get("star")

            # Kiểm tra hợp lệ số sao
            if not star or not str(star).isdigit() or int(star) not in range(1, 6):
                return Response({"message": "Số sao phải từ 1 đến 5"}, status=status.HTTP_400_BAD_REQUEST)

            place = self.get_object()

            # Tạo đánh giá nếu chưa có
            rating, created = Rating.objects.get_or_create(
                user=request.user,
                place=place,
                defaults={"star": int(star)}
            )

            if not created:
                return Response({"message": "Bạn đã đánh giá địa điểm này!"}, status=status.HTTP_200_OK)

            return Response(serializers.RatingSerializer(rating).data, status=status.HTTP_201_CREATED)
        else:
            rating = self.get_object().ratings.select_related('user').filter(active=True)
            p = RatingPagination()
            page = p.paginate_queryset(rating, self.request)
            if page:
                s = serializers.RatingSerializer(page, many=True)
                return p.get_paginated_response(s.data)
            else:
                return Response(serializers.RatingSerializer(rating, many=True).data, status=status.HTTP_200_OK)


    @action(methods=['get'], detail=True, url_path='get-average-rating')
    def get_star_average(self, request, pk):
        total_rating = self.get_object().ratings.filter(active=True)
        total_star = 0
        for rating in total_rating:
            total_star += rating.star
        count_rating = total_rating.count()
        if count_rating == 0:
            return Response({"star_average": 0.0, "total_rating": count_rating}, status=status.HTTP_200_OK)
        star_average = round(total_star / count_rating, 1)
        return Response({"star_average": star_average, "total_rating": count_rating}, status=status.HTTP_200_OK)



    @action(methods=['get', 'post'], detail=True, url_path='get-favourite')
    def get_favourite(self, request, pk):
        if request.method.__eq__("POST"):
            like, created = Favourite.objects.get_or_create(user=request.user, place=self.get_object())

            if not created:
                like.is_like = not like.is_like
                like.save()

            return Response(serializers.FavouriteSerializer(like).data, status=status.HTTP_201_CREATED)
        else:
            like = self.get_object().favourites.select_related('user').filter(active=True, is_like=True)

            p = RatingPagination()
            page = p.paginate_queryset(like, self.request)
            if page:
                s = serializers.FavouriteSerializer(page, many=True)
                return p.get_paginated_response(s.data)
            else:
                return Response(serializers.FavouriteSerializer(like, many=True).data, status=status.HTTP_200_OK)


class RoleViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Role.objects.filter(active=True)
    serializer_class = serializers.RoleSerializer

    def get_permissions(self):
        if self.request.method.__eq__("GET"):
            return [permissions.AllowAny()]
        return [perms.IsAdmin()]


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser]
    pagination_class = UserPagination

    def get_permissions(self):
        if self.action.__eq__("register"):
            return [permissions.AllowAny()]  # Mọi người đều đăng ký được

        if self.action in[ 'list', 'retrieve']:
            return [permissions.IsAuthenticated(), perms.IsAdmin()]
        # if self.action.__eq__('get_favourite_place'):
        #     return [perms.IsOwnerFavourite()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        query = self.queryset
        role = self.request.query_params.get('role')
        provider = self.request.query_params.get('provider')
        if role:
            query = query.filter(role=role)
        if provider:
            query = query.filter(is_provider=provider)
        return query

    @action(methods=['post'], url_path="register", detail=False)
    def register(self, request):
        role_id = request.data.get("role_id")
        try:
            role = Role.objects.get(pk=role_id)
        except Role.DoesNotExist:
            return Response({"message": "Không tìm thấy vai trò hợp lệ!"}, status=400)

        if role.name.lower().__eq__('admin'):
            return Response({"message": "Đăng kí vai trò không hợp lệ!"}, status=400)

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

    @action(methods=['get'], url_path='get-favourite-place', detail=False)
    def get_favourite_place(self, request):
        user = request.user
        favourite = user.favourites.select_related('place').filter(active=True, is_like=True)

        return Response(serializers.FavouriteSerializer(favourite, many=True).data, status=status.HTTP_200_OK)


class ProviderViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Provider.objects.filter(active=True)
    serializer_class = serializers.ProviderSerializer
    parser_classes = [MultiPartParser]

    def get_permissions(self):
        if self.request.method.__eq__("POST"):
            return [perms.IsProvider()]
        if self.request.method.__eq__("PATCH") and self.action.__eq__("update_provider"):
            return [perms.IsOwnerProvider()]
        if self.request.method.__eq__("GET"):
            return [permissions.IsAuthenticated()]
        return [perms.IsAdmin(), perms.IsProvider()]

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
            raise NotFound("Không tìm thấy hồ sơ công ty của bạn.")


    @action(methods=['patch'], url_path="update-provider", detail=True)
    def update_provider(self, request, pk):
        provider = self.get_object()

        for key in request.data:
            if key in ["name", 'province', 'ward', "description"]:
                setattr(provider, key, request.data[key])

        provider.save()
        return Response(serializers.ProviderSerializer(provider).data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ViewSet, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.IsOwnerComment]


class RatingViewSet(viewsets.ViewSet, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Rating.objects.filter(active=True)
    serializer_class = serializers.RatingSerializer
    permission_classes = [perms.IsOwnerRating]


class ProvinceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Province.objects.filter(active=True)
    serializer_class = ProvinceSerializer

    def get_permissions(self):
        if self.request.method.__eq__("GET"):
            return [permissions.AllowAny()]
        return [perms.IsAdmin()]


class WardViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Ward.objects.filter(active=True)
    serializer_class = serializers.WardSerializer

    def get_permissions(self):
        if self.request.method.__eq__("GET"):
            return [permissions.AllowAny()]
        return [perms.IsAdmin()]


# class FavouriteViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Favourite.objects.filter(active=True)
#     serializer_class = serializers.FavouriteSerializer

#
class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.filter(active=True).order_by('-id')
    serializer_class = serializers.TourDetailSerializer
    pagination_class = PlacePagination

    def get_permissions(self):
        if self.request.method.__eq__("GET"):
            return [permissions.AllowAny()]
        if self.action.__eq__("create"):
            return [permissions.IsAuthenticated(),perms.IsProvider()]
        if self.action in ["add_tour_place", "public_tour"]:
            return [perms.IsProvider(), perms.IsOwnerTour()]
        return [perms.IsOwnerTour()]


    # def get_serializer_class(self):
    #     if self.action.__eq__("list"):
    #         return serializers.TourSerializer
    #     return serializers.TourDetailSerializer

    def perform_create(self, serializer):
        try:
            provider = Provider.objects.get(user=self.request.user)
        except Provider.DoesNotExist:
            raise ValidationError("không tìm thấy nhà cung cấp hợp lệ hoặc bạn chưa tạo!")
        serializer.save(provider=provider)


    def get_queryset(self):
        query = self.queryset
        provider_id = self.request.query_params.get("provider_id")

        status = self.request.query_params.get("status")

        if status:
            query = query.filter(status=status)


        if provider_id:
            query = query.filter(provider_id=provider_id)

        return query


    @action(methods=['get'], url_path="get-tourplace", detail=True)
    def get_tour_place(self, request, pk):
        tour = self.get_object()
        tour_place = TourPlace.objects.filter(tour=tour)
        return Response(serializers.TourPlaceSerializer(tour_place, many=True).data, status = status.HTTP_200_OK)



    @action(methods=['post'], url_path='tour-place', detail=True)
    def add_tour_place(self, request, pk=None):
        tour = self.get_object()
        if tour.status != Tour.TourStatus.REJECTED:

            active_place_ids = list(Place.objects.filter(active=True).values_list('id', flat=True))

            tourplaces_data = request.data.get("tourplaces", [])

            if not isinstance(tourplaces_data, list) or not tourplaces_data:
                return Response({"detail": "Dữ liệu tourplaces phải là danh sách không rỗng!"},
                                status=status.HTTP_400_BAD_REQUEST)

            created_tourplaces = []

            for i, item in enumerate(tourplaces_data):
                place_id = item.get("place_id")
                visit_time = item.get("visit_time")
                order = item.get("order")

                if not place_id or place_id not in active_place_ids:
                    return Response({"detail": f"Địa điểm tại index {i} không hợp lệ hoặc không active."},
                                    status=status.HTTP_400_BAD_REQUEST)

                serializer = serializers.TourPlaceSerializer(data={
                    'tour': tour.id,
                    'place_id': place_id,
                    'visit_time': visit_time,
                    'order': order
                })

                serializer.is_valid(raise_exception=True)
                serializer.save()
                created_tourplaces.append(serializer.data)

            # Trả về dữ liệu tour chi tiết sau khi thêm thành công các tourplace
            tour_serializer = serializers.TourDetailSerializer(tour)

            return Response(tour_serializer.data, status=status.HTTP_201_CREATED)
        return Response({"message": "Chỉ tạo địa điểm cho tour nháp!"}, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['post'], detail=True, url_path="public-tour")
    def public_tour(self, request, pk):
        tour = self.get_object()
        tour.status= Tour.TourStatus.PUBLISHED
        tour.save()
        return Response(serializers.TourSerializer(tour).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path="reject-tour")
    def reject_tour(self, request, pk):
        tour = self.get_object()
        tour.status = Tour.TourStatus.REJECTED
        tour.save()
        return Response(serializers.TourSerializer(tour).data, status=status.HTTP_200_OK)