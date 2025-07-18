import uuid

from django.urls import resolve, reverse
from event_scheduler.views import (
    CategoryListCreateView,
    TimeSlotDeleteView,
    TimeSlotListCreateView,
)


def test_categories_route_resolves():
    path = reverse("categories")
    assert resolve(path).func.view_class == CategoryListCreateView


def test_timeslot_list_route_resolves():
    path = reverse("timeslot-list")
    assert resolve(path).func.view_class == TimeSlotListCreateView


def test_timeslot_delete_route_resolves():
    fake_id = uuid.uuid4()
    path = reverse("timeslot-delete", args=[fake_id])
    assert resolve(path).func.view_class == TimeSlotDeleteView
