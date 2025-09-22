import hashlib
import hmac
import json
import math
import uuid

import requests
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers, perms
from .panigation import PlacePagination, CommentPagination, RatingPagination, UserPagination
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, permission_classes
from .models import Category, Place, Image, Role, User, Provider, Comment, Rating, Favourite, Province, Payment, \
    TourPlace, Ward, Tour, Booking
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
        if self.action in ["list", "retrieve", "get_star_average"] or (self.action in ['get_comment', 'get_rating', 'get_favourite', 'get_nearby', 'nearby_current'] and self.request.method=="GET"):
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

    def haversine(self, lat1, lon1, lat2, lon2):
        import math
        lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])  # ép tất cả về float
        R = 6371  # km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) \
            * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        return R * c

    @action(methods=['get'], detail=True, url_path='nearby')
    def get_nearby(self, request, pk=None):
        place = self.get_object()

        if not place.latitude or not place.longitude:
            return Response({"error": "This place does not have coordinates"}, status=400)

        places = Place.objects.exclude(id=place.id).exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        distances = []

        for p in places:
            distance = self.haversine(place.latitude, place.longitude, p.latitude, p.longitude)
            distances.append((distance, p))

        distances.sort(key=lambda x: x[0])
        nearest_places = [p for _, p in distances[:5]]

        serializer = serializers.PlaceDetailSerializer(nearest_places, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='nearby-current')
    def nearby_current(self, request):
        try:
            lat = float(request.query_params.get("lat"))
            lng = float(request.query_params.get("lng"))
        except (TypeError, ValueError):
            return Response({"error": "Thiếu hoặc sai định dạng lat/lng"}, status=status.HTTP_400_BAD_REQUEST)

        places = Place.objects.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        distances = []

        for p in places:
            distance = self.haversine(lat, lng, p.latitude, p.longitude)
            distances.append((distance, p))

        distances.sort(key=lambda x: x[0])
        nearest_places = [{"distance": round(d, 2), **serializers.PlaceDetailSerializer(p).data} for d, p in distances[:5]]

        return Response(nearest_places, status=status.HTTP_200_OK)

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
        if self.action.__eq__("check_booking"):
            return [permissions.IsAuthenticated()]
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
        tourplaces = tour.tourplaces.all()
        if tourplaces.count() == 0:
            return Response({"message": "Chuyến đi này chưa có danh sách địa điểm!"}, status=status.HTTP_400_BAD_REQUEST)
        tour.status= Tour.TourStatus.PUBLISHED
        tour.save()
        return Response(serializers.TourSerializer(tour).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path="reject-tour")
    def reject_tour(self, request, pk):
        tour = self.get_object()
        if Booking.objects.filter(tour=tour).exists():
            raise ValidationError({"message": "Không thể hủy tour vì đã có người đặt!"})
        tour.status = Tour.TourStatus.REJECTED
        tour.save()
        return Response(serializers.TourSerializer(tour).data, status=status.HTTP_200_OK)

    @action(methods=['get'],url_path="check-booking", detail=True)
    def check_booking(self, request, pk):
        tour = self.get_object()
        booked = Booking.objects.filter(user=request.user.id, tour=tour.id).first()
        if not booked:
            return Response({'has_booked': 0})
        if booked.status == Booking.BookingStatus.PAID:
            return Response({"has_booked": 1})
        return Response({'has_booked': 0})



class BookingViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Booking.objects.select_related("user", "tour__provider").filter(active=True)
    serializer_class = serializers.BookingSerializer


    def get_serializer_class(self):
        if self.action.__eq__("retrieve"):
            return serializers.BookingDetailSerializer
        return serializers.BookingSerializer


    def get_permissions(self):
        if self.action in ["retrieve", "get_booking_by_user_id"]:
            return [perms.IsOwnerBooking()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        tour = serializer.validated_data.get("tour")

        if tour.status != Tour.TourStatus.PUBLISHED:
            raise ValidationError("Tour này chưa được mở đặt!")

        booking = serializer.save(user=self.request.user)

        payment = serializers.PaymentSerializer(data={
            "price": booking.total_price,
        })
        payment.is_valid(raise_exception=True)
        payment.save(booking=booking)

        subject = "Xác nhận đặt tour thành công"
        message = f"""
                Xin chào {self.request.user.username},

                Bạn đã đặt tour: {tour.title}
                Ngày bắt đầu: {booking.tour.start_date}
                Số người: {booking.number_of_people}
                Tổng tiền: {booking.total_price} VNĐ
                Mã đặt tour: TOUR_VM_{booking.id}
                Tình trạng thanh toán: {booking.payment.status}

                Cảm ơn bạn đã sử dụng dịch vụ!
                """
        recipient = [self.request.user.email]

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient,
            fail_silently=False
        )

    @action(detail=True, methods=["post"], url_path="create_payment")
    def create_payment(self, request, pk=None):
        booking = self.get_object()  # lấy ra booking theo pk
        payment = booking.payment  # lấy Payment đã gắn khi booking tạo

        if payment.status != Payment.PaymentStatus.PENDING:
            return Response({"error": "Booking này đã được xử lý thanh toán."}, status=400)

        amount = str(request.data.get("amount", booking.total_price))  # lấy số tiền từ request hoặc booking

        order_id = str(uuid.uuid4())
        request_id = str(uuid.uuid4())
        order_info = f"Thanh toán cho booking #{booking.id}"
        extra_data = ""

        raw_signature = f"accessKey={settings.MOMO_ACCESS_KEY}&amount={amount}&extraData={extra_data}&ipnUrl={settings.MOMO_NOTIFY_URL}&orderId={order_id}&orderInfo={order_info}&partnerCode={settings.MOMO_PARTNER_CODE}&redirectUrl={settings.MOMO_RETURN_URL}&requestId={request_id}&requestType=captureWallet"

        h = hmac.new(
            settings.MOMO_SECRET_KEY.encode("utf-8"),
            raw_signature.encode("utf-8"),
            hashlib.sha256
        )
        signature = h.hexdigest()

        data = {
            "partnerCode": settings.MOMO_PARTNER_CODE,
            "accessKey": settings.MOMO_ACCESS_KEY,
            "requestId": request_id,
            "amount": amount,
            "orderId": order_id,
            "orderInfo": order_info,
            "redirectUrl": settings.MOMO_RETURN_URL,
            "ipnUrl": settings.MOMO_NOTIFY_URL,
            "extraData": extra_data,
            "requestType": "captureWallet",
            "signature": signature,
            "lang": "vi"
        }

        # cập nhật order_id để sau này Notify còn tìm được
        payment.order_id = order_id
        payment.save()

        res = requests.post(settings.MOMO_ENDPOINT, json=data)
        return Response(res.json())

    @action(methods=["get"], detail=False, url_path="get-list-booking")
    def get_booking_by_user_id(self, request):
        bookings = Booking.objects.filter(user_id=request.user)
        return Response(serializers.BookingDetailSerializer(bookings, many=True).data, status=status.HTTP_200_OK)



@method_decorator(csrf_exempt, name="dispatch")
class MomoNotify(APIView):
    def post(self, request):
        data = request.data
        print("Notify từ MoMo:", data)

        order_id = data.get("orderId")
        result_code = str(data.get("resultCode"))

        try:
            payment = Payment.objects.get(order_id=order_id)
            booking = payment.booking  # nhờ OneToOneField

            if result_code == "0":
                payment.status = Payment.PaymentStatus.PAID
                booking.status = Booking.BookingStatus.PAID
            else:
                payment.status = Payment.PaymentStatus.CANCELLED
                booking.status = Booking.BookingStatus.CANCELED

            payment.save()
            booking.save()
            print(f"Update thành công: Payment={payment.status}, Booking={booking.status}")

        except Payment.DoesNotExist:
            print("Payment không tồn tại với orderId:", order_id)

        return JsonResponse({"message": "success"})



class MomoReturn(APIView):
    def get(self, request):
        return HttpResponse("Thanh toán đã xử lý. Vui lòng quay lại app.")
