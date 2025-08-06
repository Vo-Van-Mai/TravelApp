from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

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

urlpatterns = [
    path('', include(router.urls)),
]