from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='category')
router.register('places', views.PlaceViewSet, basename='place')
router.register('roles', views.RoleViewSet, basename='role')
router.register('users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]