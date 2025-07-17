from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import EventCategory, TimeSlot
from .serializers import (
    EventCategorySerializer,
    TimeSlotSerializer,
)


class CategoryListCreateView(generics.ListCreateAPIView):
    """
    API view for listing and creating event categories.

    GET: Returns a list of all event categories (authenticated users).
    POST: Creates a new category (staff users only).
    """

    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handles category creation. Only staff users are allowed.

        Returns 403 Forbidden for non-staff users.
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN
            )
        return super().post(request, *args, **kwargs)


class TimeSlotListCreateView(generics.ListCreateAPIView):
    """
    API view for listing and creating time slots.

    GET: Returns a filtered list of time slots by category or date range.
    POST: Creates a new time slot (staff users only, sets is_booked to False).
    """

    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optionally filters the queryset by event category and/or date range.
        Orders results by start date/time.
        """
        qs = (
            TimeSlot.objects.select_related("category")
            .prefetch_related("booking")
            .all()
        )
        category_ids = self.request.query_params.getlist("category")
        if category_ids:
            qs = qs.filter(category__id__in=category_ids)
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date and end_date:
            qs = qs.filter(
                start_dt__date__gte=start_date, start_dt__date__lte=end_date
            )
        return qs.order_by("start_dt")

    def post(self, request, *args, **kwargs):
        """
        Handles creation of a new time slot.

        Only staff users are allowed. Sets is_booked to False by default.
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN
            )
        request.data["is_booked"] = False
        return super().post(request, *args, **kwargs)


class TimeSlotDeleteView(generics.DestroyAPIView):
    """
    API view for deleting a time slot.

    Only admin users can delete. Booked time slots cannot be deleted.
    """

    queryset = TimeSlot.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "id"

    def delete(self, request, *args, **kwargs):
        """
        Deletes the time slot if it is not booked.

        Returns 400 Bad Request if the slot is already booked.
        """
        timeslot = self.get_object()
        if timeslot.is_booked:
            return Response(
                {"detail": "Cannot delete a booked time slot."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().delete(request, *args, **kwargs)
