from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from event_scheduler.models import EventCategory, TimeSlot

from bookings.models import Booking

User = get_user_model()


@pytest.mark.django_db
def test_booking_str_returns_slot_and_user():
    user = User.objects.create_user(username="u1", password="pw")
    category = EventCategory.objects.create(name="TestCat")
    ts = TimeSlot.objects.create(
        start_dt=timezone.now(),
        end_dt=timezone.now() + timedelta(hours=1),
        category=category,
    )
    booking = Booking.objects.create(timeslot=ts, user=user)

    expected = f"Booking(slot={ts.id}, user={user.id})"
    assert str(booking) == expected
