from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/bookings/", include("bookings.urls")),
    path("api/users/", include("users.urls")),
    path("api/event_scheduler/", include("event_scheduler.urls")),
    path("api/health/", lambda request: HttpResponse("Healthy")),
]
