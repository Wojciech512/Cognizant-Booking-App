import uuid
from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from event_scheduler.models import EventCategory, TimeSlot
from rest_framework.test import APIClient

from bookings.models import Booking

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def regular_user():
    return User.objects.create_user(username="u3", password="pw")


@pytest.fixture
def staff_user():
    return User.objects.create_user(
        username="staff", password="pw", is_staff=True
    )


@pytest.fixture
def category():
    return EventCategory.objects.create(name="Cat")


@pytest.fixture
def timeslot(category):
    return TimeSlot.objects.create(
        start_dt=timezone.now(),
        end_dt=timezone.now() + timedelta(hours=1),
        category=category,
    )


@pytest.mark.django_db
class TestBookingCreateView:
    def test_missing_timeslot_returns_400(self, client, regular_user):
        client.force_authenticate(regular_user)
        resp = client.post(reverse("booking-create"), {})
        assert resp.status_code == 400

    def test_nonexistent_timeslot_raises_404(self, client, regular_user):
        client.force_authenticate(regular_user)
        fake_uuid = str(uuid.uuid4())
        resp = client.post(reverse("booking-create"), {"timeslot": fake_uuid})
        assert resp.status_code == 404

    def test_successful_booking_marks_slot_booked(
        self, client, regular_user, timeslot
    ):
        client.force_authenticate(regular_user)
        resp = client.post(
            reverse("booking-create"), {"timeslot": timeslot.id}
        )
        assert resp.status_code == 201
        booking_id = resp.data["id"]
        assert Booking.objects.filter(id=booking_id).exists()
        timeslot.refresh_from_db()
        assert timeslot.is_booked

    def test_double_booking_returns_409(self, client, regular_user, timeslot):
        Booking.objects.create(timeslot=timeslot, user=regular_user)
        timeslot.is_booked = True
        timeslot.save()
        client.force_authenticate(regular_user)
        resp = client.post(
            reverse("booking-create"), {"timeslot": timeslot.id}
        )
        assert resp.status_code == 409


@pytest.mark.django_db
class TestBookingDeleteView:
    def test_forbidden_if_not_owner_or_staff(
        self, client, regular_user, timeslot
    ):
        other = User.objects.create_user(username="other", password="pw")
        booking = Booking.objects.create(timeslot=timeslot, user=other)
        timeslot.is_booked = True
        timeslot.save()
        client.force_authenticate(regular_user)
        resp = client.delete(reverse("booking-delete", args=[booking.id]))
        assert resp.status_code == 403

    def test_owner_can_delete_and_unbooks(
        self, client, regular_user, timeslot
    ):
        booking = Booking.objects.create(timeslot=timeslot, user=regular_user)
        timeslot.is_booked = True
        timeslot.save()
        client.force_authenticate(regular_user)
        resp = client.delete(reverse("booking-delete", args=[booking.id]))
        assert resp.status_code == 204
        assert not Booking.objects.filter(id=booking.id).exists()
        timeslot.refresh_from_db()
        assert not timeslot.is_booked

    def test_staff_can_delete_any(
        self, client, staff_user, regular_user, timeslot
    ):
        booking = Booking.objects.create(timeslot=timeslot, user=regular_user)
        timeslot.is_booked = True
        timeslot.save()
        client.force_authenticate(staff_user)
        resp = client.delete(reverse("booking-delete", args=[booking.id]))
        assert resp.status_code == 204
        assert not Booking.objects.filter(id=booking.id).exists()
