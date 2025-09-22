from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

from .views import MomoNotify, MomoReturn

# from .views import vnpay_return

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='category')
router.register('places', views.PlaceViewSet, basename='place')
router.register('roles', views.RoleViewSet, basename='role')
router.register('users', views.UserViewSet, basename='user')
router.register('providers', views.ProviderViewSet, basename='provider')
router.register('comments', views.CommentViewSet, basename='comment')
router.register('ratings', views.RatingViewSet, basename='rating')
router.register('provinces', views.ProvinceViewSet, basename='province')
router.register('wards', views.WardViewSet, basename='ward')
router.register('tours', views.TourViewSet, basename='tour')
router.register('bookings', views.BookingViewSet, basename='booking')
# router.register('payments', views.PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    # path('vnpay_return/', vnpay_return, name='vnpay_return'),
    # path("vnpay_ipn/", views.vnpay_ipn, name="vnpay_ipn"),
    path("momo/notify/", MomoNotify.as_view(), name="momo-notify"),
    path("momo/return/", MomoReturn.as_view(), name="momo-return"),
]