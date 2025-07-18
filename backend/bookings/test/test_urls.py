from django.urls import resolve, reverse

from bookings.views import BookingCreateView, BookingDeleteView


def test_booking_create_url_resolves():
    path = reverse("booking-create")
    resolver = resolve(path)
    assert resolver.func.view_class == BookingCreateView


def test_booking_delete_url_resolves():
    fake_pk = 123
    path = reverse("booking-delete", args=[fake_pk])
    resolver = resolve(path)
    assert resolver.func.view_class == BookingDeleteView
