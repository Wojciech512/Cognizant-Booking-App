import uuid

from django.db import models


class EventCategory(models.Model):
    """
    Model representing an event category (e.g., 'Workshop', 'Conference').

    Attributes:
        name (str): Unique name of the category (max 100 chars).
    """

    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        """
        Return the string representation of the event category.
        """
        return self.name


class TimeSlot(models.Model):
    """
    Model representing a single time slot for an event.

    Attributes:
        id (UUID): Unique identifier for the time slot (primary key).
        start_dt (datetime): Start date and time of the slot.
        end_dt (datetime): End date and time of the slot.
        category (EventCategory): Foreign key to the related event category.
        is_booked (bool): Indicates if the slot is already booked.
    """

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    start_dt = models.DateTimeField()
    end_dt = models.DateTimeField()
    category = models.ForeignKey(
        EventCategory, on_delete=models.CASCADE, related_name="timeslots"
    )
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        """
        Return a human-readable representation of the time slot.
        """
        return f"{self.category.name} @ {self.start_dt:%Y-%m-%d %H:%M}"
