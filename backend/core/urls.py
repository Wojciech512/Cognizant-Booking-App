from django.contrib import admin
from django.http import HttpResponse
from django.urls import path
from event_scheduler.views import (
    CategoryListCreateView,
    TimeSlotDeleteView,
    TimeSlotListCreateView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    AppTokenObtainPairView,
    LogoutAllView,
    LogoutView,
    RegisterUserView,
)

from bookings.views import BookingCreateView, BookingDeleteView

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/token/",
        AppTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),
    path("api/register/", RegisterUserView.as_view(), name="register"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/logout_all/", LogoutAllView.as_view(), name="logout_all"),
    path("categories/", CategoryListCreateView.as_view(), name="categories"),
    path(
        "timeslots/", TimeSlotListCreateView.as_view(), name="timeslot-list"
    ),
    path(
        "timeslots/<uuid:id>/",
        TimeSlotDeleteView.as_view(),
        name="timeslot-delete",
    ),
    path("bookings/", BookingCreateView.as_view(), name="booking-create"),
    path(
        "bookings/<int:pk>/",
        BookingDeleteView.as_view(),
        name="booking-delete",
    ),
    path("health/", lambda request: HttpResponse("Healthy")),
]
