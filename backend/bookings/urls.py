from django.urls import path
from rest_framework import routers

from bookings.views import BookingCreateView, BookingDeleteView

routers = routers.SimpleRouter()

# URL patterns for booking creation and deletion endpoints.

urlpatterns = [
    path("", BookingCreateView.as_view(), name="booking-create"),
    path(
        "<int:pk>/",
        BookingDeleteView.as_view(),
        name="booking-delete",
    ),
]

urlpatterns += routers.urls
