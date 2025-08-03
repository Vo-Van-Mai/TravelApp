from rest_framework.pagination import PageNumberPagination

class PlacePagination(PageNumberPagination):
    page_size = 5


class CommentPagination(PageNumberPagination):
    page_size = 5

class RatingPagination(PageNumberPagination):
    page_size = 10