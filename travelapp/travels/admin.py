from django.contrib import admin
from django.db.models.aggregates import Count, Avg
from django.template.response import TemplateResponse
from django.urls import path, include

from .models import Category, Place, Province, User, Role, Ward, Provider, TourPlace, Tour, Image, Booking, \
    Payment,Favourite, Itinerary, ItineraryItem, Comment, Rating,Conversation, Message

from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class PlaceForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)
    class Meta:
        model = Place
        fields = '__all__'


class MyPlaceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'active', 'created_date']
    list_filter = ['id']
    search_fields = ['name']
    form = PlaceForm


    class Media:
        css = {
            'all': ('/static/css/styles.css',)
        }


class MyAdminSite(admin.AdminSite):
    site_header = "E-Travels"

    def get_urls(self):
        return [path('travel-stats/', self.travel_stats),] + super().get_urls()

    def travel_stats(self, request):
        stats = Category.objects.annotate(place_count=Count("place__id")).values('id', 'name', 'place_count')
        stats_province = Province.objects.annotate(place_count=Count("place__id")).values("id", "name", "place_count")

        top_places = Place.objects.annotate(avg_star=Avg("rating__star")).values("id", "name", "avg_star").order_by("-avg_star")[:5]
        avg_rating = Place.objects.annotate(avg_star=Avg("rating__star")).values("id", "name", "avg_star").order_by("-avg_star")

        print(top_places)

        return TemplateResponse(request, 'admin/stats.html', {
            'stats': stats,
            'stats_province': stats_province,
            'top_places': top_places,
            'avg_rating': avg_rating
        })


admin_site = MyAdminSite(name="travels")

admin_site.register(User)
admin_site.register(Provider)
admin_site.register(Category)
admin_site.register(Place, MyPlaceAdmin)
admin_site.register(Province)
admin_site.register(Role)
admin_site.register(Ward)
admin_site.register(Tour)
admin_site.register(TourPlace)
admin_site.register(Image)
admin_site.register(Booking)
admin_site.register(Favourite)
admin_site.register(Comment)
admin_site.register(Rating)
admin_site.register(Itinerary)
admin_site.register(Payment)
admin_site.register(ItineraryItem)
admin_site.register(Conversation)
admin_site.register(Message)


