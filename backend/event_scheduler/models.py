import uuid

from django.db import models


class EventCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TimeSlot(models.Model):
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
        return f"{self.category.name} @ {self.start_dt:%Y-%m-%d %H:%M}"
