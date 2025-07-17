from django.urls import path
from event_scheduler.views import (
    CategoryListCreateView,
    TimeSlotDeleteView,
    TimeSlotListCreateView,
)
from rest_framework import routers

routers = routers.SimpleRouter()

# URL patterns for event category and time slot management API.

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="categories"),
    path(
        "timeslots/",
        TimeSlotListCreateView.as_view(),
        name="timeslot-list",
    ),
    path(
        "timeslots/<uuid:id>/",
        TimeSlotDeleteView.as_view(),
        name="timeslot-delete",
    ),
]

urlpatterns += routers.urls
