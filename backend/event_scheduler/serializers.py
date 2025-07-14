from rest_framework import serializers

from .models import EventCategory, TimeSlot


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ["id", "name"]


class TimeSlotSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all()
    )
    booked_by_current_user = serializers.SerializerMethodField()
    my_booking_id = serializers.SerializerMethodField()

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
        ]

    def get_booked_by_current_user(self, obj):
        request = self.context.get("request")
        if not request or not request.user or not obj.is_booked:
            return False
        return (
            hasattr(obj, "booking") and obj.booking.user_id == request.user.id
        )

    def get_my_booking_id(self, obj):
        if (
            hasattr(obj, "booking")
            and obj.booking
            and self.get_booked_by_current_user(obj)
        ):
            return obj.booking.id
        return None

    def validate(self, data):
        if data["end_dt"] <= data["start_dt"]:
            raise serializers.ValidationError(
                "End time must be after start time."
            )
        return data
