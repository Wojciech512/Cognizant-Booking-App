from event_scheduler.models import TimeSlot
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
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
        user = self.context["request"].user
        timeslot = validated_data["timeslot"]
        return Booking.objects.create(timeslot=timeslot, user=user)
