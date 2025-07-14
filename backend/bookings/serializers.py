from event_scheduler.models import TimeSlot
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    timeslot = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlot.objects.all()
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "timeslot", "user", "booked_at"]
        read_only_fields = ["user", "booked_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        timeslot = validated_data["timeslot"]
        return Booking.objects.create(timeslot=timeslot, user=user)
