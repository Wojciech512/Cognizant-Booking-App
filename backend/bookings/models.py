from django.conf import settings
from django.db import models
from event_scheduler.models import TimeSlot


class Booking(models.Model):
    """
    Model representing a reservation for a single time slot.

    Each Booking links a user to a unique TimeSlot (OneToOne relation).
    Tracks the creation timestamp of the booking.
    """

    timeslot = models.OneToOneField(
        TimeSlot, on_delete=models.CASCADE, related_name="booking"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Return a string representation for this Booking instance.
        """
        return f"Booking(slot={self.timeslot_id}, user={self.user_id})"
