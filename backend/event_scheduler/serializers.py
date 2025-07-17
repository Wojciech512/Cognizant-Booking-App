from rest_framework import serializers

from bookings.serializers import BookingSerializer

from .models import EventCategory, TimeSlot


class EventCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the EventCategory model.

    Serializes the id and name fields for API representation.
    """

    class Meta:
        model = EventCategory
        fields = ["id", "name"]


class TimeSlotSerializer(serializers.ModelSerializer):
    """
    Serializer for the TimeSlot model.

    Includes additional fields indicating booking status for the current user
    and detailed booking information (nested BookingSerializer).
    """

    category = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all()
    )
    booked_by_current_user = serializers.SerializerMethodField()
    my_booking_id = serializers.SerializerMethodField()
    booking = BookingSerializer(read_only=True)

    class Meta:
        model = TimeSlot
        fields = [
            "id",
            "start_dt",
            "end_dt",
            "is_booked",
            "category",
            "booked_by_current_user",
            "my_booking_id",
            "booking",
        ]

    def get_booked_by_current_user(self, obj):
        """
        Returns True if the current user has booked this time slot, False otherwise.
        """
        request = self.context.get("request")
        if not request or not request.user or not obj.is_booked:
            return False
        return (
            hasattr(obj, "booking") and obj.booking.user_id == request.user.id
        )

    def get_my_booking_id(self, obj):
        """
        Returns the booking ID if the current user has booked this time slot, otherwise None.
        """
        if (
            hasattr(obj, "booking")
            and obj.booking
            and self.get_booked_by_current_user(obj)
        ):
            return obj.booking.id
        return None

    def validate(self, data):
        """
        Validates that the end time is after the start time.

        Raises:
            serializers.ValidationError: If end_dt is not after start_dt.
        """
        if data["end_dt"] <= data["start_dt"]:
            raise serializers.ValidationError(
                "End time must be after start time."
            )
        return data
