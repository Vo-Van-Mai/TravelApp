from django.contrib import admin

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


