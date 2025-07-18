from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from event_scheduler.models import EventCategory, TimeSlot
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

from bookings.models import Booking
from bookings.serializers import BookingSerializer

User = get_user_model()


@pytest.mark.django_db
class TestBookingSerializer:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.user = User.objects.create_user(username="u2", password="pw")
        self.cat = EventCategory.objects.create(name="TestCat")
        self.ts = TimeSlot.objects.create(
            start_dt=timezone.now(),
            end_dt=timezone.now() + timedelta(hours=1),
            category=self.cat,
        )

    def test_serialization_fields(self):
        booking = Booking.objects.create(timeslot=self.ts, user=self.user)
        serializer = BookingSerializer(booking)
        data = serializer.data

        assert set(data.keys()) == {
            "id",
            "timeslot",
            "user",
            "booked_at",
            "username",
        }
        assert data["timeslot"] == self.ts.id
        assert data["username"] == self.user.username

    def test_create_uses_request_user(self):
        factory = APIRequestFactory()
        request = factory.post("/", {"timeslot": self.ts.id}, format="json")
        request = Request(request)
        request.user = self.user
        serializer = BookingSerializer(
            data={"timeslot": self.ts.id}, context={"request": request}
        )
        assert serializer.is_valid(), serializer.errors

        booking = serializer.save()

        assert booking.user == self.user
        assert booking.timeslot == self.ts
