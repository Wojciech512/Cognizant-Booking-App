from event_scheduler.models import TimeSlot
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    """
    Serializer for the Booking model.

    Serializes booking details for API representation. Handles
    timeslot selection and exposes related user information.
    """

    timeslot = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlot.objects.all()
    )
    user = serializers.StringRelatedField(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "timeslot", "user", "booked_at", "username"]
        read_only_fields = ["user", "booked_at", "username"]

    def create(self, validated_data):
        """
        Create and return a new Booking instance for the current user.

        Associates the booking with the provided timeslot and the
        authenticated user in request context.
        """

        user = self.context["request"].user
        timeslot = validated_data["timeslot"]
        return Booking.objects.create(timeslot=timeslot, user=user)
