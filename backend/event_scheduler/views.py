from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import EventCategory, TimeSlot
from .serializers import (
    EventCategorySerializer,
    TimeSlotSerializer,
)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN
            )
        return super().post(request, *args, **kwargs)


class TimeSlotListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
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
        if not request.user.is_staff:
            return Response(
                {"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN
            )
        request.data["is_booked"] = False
        return super().post(request, *args, **kwargs)


class TimeSlotDeleteView(generics.DestroyAPIView):
    queryset = TimeSlot.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "id"

    def delete(self, request, *args, **kwargs):
        timeslot = self.get_object()
        if timeslot.is_booked:
            return Response(
                {"detail": "Cannot delete a booked time slot."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().delete(request, *args, **kwargs)
