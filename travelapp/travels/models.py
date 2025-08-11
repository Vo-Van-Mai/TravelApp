from importlib.metadata import requires

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField
from smart_selects.db_fields import ChainedForeignKey


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Role(BaseModel):
    name = models.CharField(max_length=100, unique=True, null=False, blank=False)

    def __str__(self):
        return self.name


class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, related_name="users", related_query_name="user", null=True)
    avatar = CloudinaryField(null=False)
    is_provider = models.BooleanField(default=False)
    phone = models.CharField(null=True, max_length=11, blank=True, unique=True)


    def __str__(self):
        return self.username



class Category(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Province(BaseModel):
    name = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return self.name



class Ward(BaseModel):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="wards", related_query_name="ward")

    class Meta:
        unique_together = ('name', 'province')

    def __str__(self):
        return self.name


class Place(BaseModel):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    description = RichTextField()
    address = models.CharField(max_length=255, unique=True, blank=False, null=False)
    open_hours = models.TimeField(null=True)
    close_hours = models.TimeField(null=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name="places", related_query_name="place", null=False, blank=False)
    ward = ChainedForeignKey(Ward, chained_field="province", chained_model_field="province", show_all=False, auto_choose=True, sort=True, on_delete=models.PROTECT, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="places", related_query_name="place")

    def __str__(self):
        return self.name



class Provider(BaseModel):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = RichTextField(default="Chưa có mô tả!", null=False)
    avatar = CloudinaryField()
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    address = models.CharField(max_length=100, null=False)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name="providers", related_query_name="provider",
                                 null=False, blank=False)
    ward = ChainedForeignKey(Ward, chained_field="province", chained_model_field="province", show_all=False,
                             auto_choose=True, sort=True, on_delete=models.PROTECT, null=False, blank=False)

    def __str__(self):
        return self.name


class Tour(BaseModel):
    title = models.TextField()
    description = RichTextField()
    price = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    start_date = models.DateField()
    end_date = models.DateField()

    class TourStatus(models.TextChoices):
        DRAFT = 'draft', 'Nháp'
        PUBLISHED = 'published', 'Đã xuất bản'
        REJECTED = 'rejected', 'Bị từ chối'
        RUNNING = 'running', 'Đang diễn ra'
        COMPLETED = 'completed', 'Đã hoàn thành'
        CANCELLED = 'cancelled', 'Đã hủy'

    status = models.CharField(max_length=20, choices=TourStatus.choices, default=TourStatus.DRAFT)
    discount = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    capacity = models.IntegerField()
    booked = models.IntegerField(default=0)

    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="tours", related_query_name="tour")

    @property
    def duration_days(self):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return delta.days + 1
        return 0

    @property
    def duration_display(self):
        days = self.duration_days
        if days >= 2:
            return f"{days} ngày {days - 1} đêm"
        elif days == 1:
            return "1 ngày"
        return "Chưa xác định"


class TourPlace(BaseModel):
    visit_time = models.DateTimeField()
    order = models.IntegerField()
    tour = models.ForeignKey(Tour, on_delete=models.PROTECT, related_name="tourplaces", related_query_name="tourplace")
    place = models.ForeignKey(Place, on_delete=models.PROTECT, related_name="tourplaces", related_query_name="tourplace")


class Image(BaseModel):
    title = models.CharField(max_length=255)
    url_path = CloudinaryField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="images")

    def __str__(self):
        return self.title



class Booking(BaseModel):
    total_price = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    number_of_people = models.IntegerField()

    class BookingStatus(models.TextChoices):
        PENDING = 'pending', 'Chờ xác nhận'
        CONFIRMED = 'confirmed', 'Đã xác nhận'
        PAID = 'paid', 'Đã thanh toán'
        CANCELED = 'canceled', 'Đã hủy'
        REJECTED = 'rejected', 'Bị từ chối'
        COMPLETED = 'completed', 'Đã hoàn thành'

    status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    payment_method = models.CharField(max_length=20, default="Ví điện tử")
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="bookings")
    tour = models.ForeignKey(Tour, on_delete=models.PROTECT, related_name="bookings")



class Payment(BaseModel):
    price = models.DecimalField(max_digits=10, decimal_places=0)

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Đang chờ"
        PAID = "Paid", "Đã thanh toán"
        CANCELLED = "Cancelled", "Đã hủy"

    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)

    booking = models.OneToOneField(Booking, on_delete=models.PROTECT, null=True)



class Favourite(BaseModel):
    is_like = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="favourites", related_query_name="favourite", null=True)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="favourites", related_query_name="favourite")

    class Meta:
        unique_together = ('user', 'place')


class Itinerary(BaseModel):
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    note = models.TextField()

    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="itineraries", related_query_name="itinerary")

    @property
    def duration_days(self):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return delta.days + 1
        return 0

    @property
    def duration_display(self):
        days = self.duration_days
        if days >= 2:
            return f"{days} ngày {days - 1} đêm"
        elif days == 1:
            return "1 ngày"
        return "Chưa xác định"

    def __str__(self):
        return self.title


class ItineraryItem(BaseModel):
    start_date = models.DateField()
    end_date = models.DateField()
    note = models.TextField()

    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name="itineraryItems", related_query_name="itineraryItem")
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="itineraryItems", related_query_name="itineraryItem")
    @property
    def duration_days(self):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return delta.days + 1
        return 0

    @property
    def duration_display(self):
        days = self.duration_days
        if days >= 2:
            return f"{days} ngày {days - 1} đêm"
        elif days == 1:
            return "1 ngày"
        return "Chưa xác định"


class Review(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Rating(Review):
    star = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings", related_query_name="rating")
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="ratings", related_query_name="rating")

    def __str__(self):
        return f"{self.star}"


class Comment(Review):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", related_query_name="comment")
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="comments", related_query_name="comment")
    content = models.TextField()
    parent = models.ForeignKey("Comment", on_delete=models.CASCADE, related_name="comments", related_query_name="comment", null=True, blank=True)


    def __str__(self):
        return self.content


class Conversation(BaseModel):
    title = models.CharField(max_length=255, null=True)
    users = models.ManyToManyField(User, related_name="conversations", related_query_name="conversation")


class Message(BaseModel):
    content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="messages", related_query_name="message", null=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages", related_query_name="message", null=True)
    def __str__(self):
        return self.content

