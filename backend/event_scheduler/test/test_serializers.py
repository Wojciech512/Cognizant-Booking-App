from datetime import timedelta

import pytest
from django.contrib.auth.models import AnonymousUser, User
from django.utils import timezone
from event_scheduler.models import EventCategory, TimeSlot
from event_scheduler.serializers import (
    EventCategorySerializer,
    TimeSlotSerializer,
)
from rest_framework.serializers import ValidationError
from rest_framework.test import APIRequestFactory

from bookings.models import Booking


@pytest.fixture
def factory():
    return APIRequestFactory()


@pytest.fixture
def user():
    return User.objects.create_user(
        username="testUser1", password="testUser1Pass"
    )


@pytest.fixture
def other_user():
    return User.objects.create_user(
        username="testUser2", password="testUser2Pass"
    )


@pytest.fixture
def category():
    return EventCategory.objects.create(name="TestCat")


@pytest.mark.django_db
class TestEventCategorySerializer:
    def test_serializes_id_and_name(self, category):
        data = EventCategorySerializer(category).data
        assert data == {"id": category.id, "name": "TestCat"}


@pytest.mark.django_db
class TestTimeSlotSerializer:
    def setup_method(self):
        self.start = timezone.now()
        self.end = self.start + timedelta(hours=1)

    def get_serializer(self, ts, factory, user=None):
        request = factory.get("/")
        request.user = user or AnonymousUser()
        return TimeSlotSerializer(ts, context={"request": request})

    def test_validate_rejects_end_before_start(self, category):
        data = {
            "start_dt": self.start,
            "end_dt": self.start - timedelta(minutes=5),
            "category": category.id,
        }
        serializer = TimeSlotSerializer(data=data)
        with pytest.raises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_validate_accepts_proper_range(self, category):
        data = {
            "start_dt": self.start,
            "end_dt": self.end,
            "category": category.id,
        }
        serializer = TimeSlotSerializer(data=data)
        assert serializer.is_valid()

    def test_booked_by_current_user_false_when_not_booked(
        self, category, user, factory
    ):
        ts = TimeSlot.objects.create(
            start_dt=self.start,
            end_dt=self.end,
            category=category,
            is_booked=False,
        )
        serializer = self.get_serializer(ts, factory, user)
        assert serializer.data["booked_by_current_user"] is False
        assert serializer.data.get("my_booking_id") is None

    def test_booked_by_current_user_false_if_other_user(
        self, category, other_user, user, factory
    ):
        ts = TimeSlot.objects.create(
            start_dt=self.start,
            end_dt=self.end,
            category=category,
            is_booked=True,
        )
        Booking.objects.create(timeslot=ts, user=other_user)
        serializer = self.get_serializer(ts, factory, user)
        assert serializer.data["booked_by_current_user"] is False
        assert serializer.data.get("my_booking_id") is None

    def test_booked_by_current_user_true_and_returns_booking_id(
        self, category, user, factory
    ):
        ts = TimeSlot.objects.create(
            start_dt=self.start,
            end_dt=self.end,
            category=category,
            is_booked=True,
        )
        booking = Booking.objects.create(timeslot=ts, user=user)
        serializer = self.get_serializer(ts, factory, user)
        assert serializer.data["booked_by_current_user"] is True
        assert serializer.data.get("my_booking_id") == booking.id
