from django.db import transaction
from django.http import Http404
from event_scheduler.models import TimeSlot
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer


class BookingCreateView(generics.CreateAPIView):
    """
    API endpoint for creating a booking for a given time slot.

    Ensures transactional integrity: the booking is only created if the time slot
    is available (not already booked). Sets the slot as booked upon creation.
    """

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Attempt to book the given time slot for the authenticated user.

        Returns 201 Created with booking details on success.
        Returns 409 Conflict if the slot is already booked.
        Returns 400 Bad Request if timeslot ID is missing.
        Raises 404 if the timeslot does not exist.
        """
        timeslot_id = request.data.get("timeslot")
        if not timeslot_id:
            return Response(
                {"detail": "Missing timeslot id."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            with transaction.atomic():
                slot = TimeSlot.objects.select_for_update().get(
                    id=timeslot_id
                )
                if slot.is_booked:
                    return Response(
                        {"detail": "Time slot already booked."},
                        status=status.HTTP_409_CONFLICT,
                    )
                booking = Booking.objects.create(
                    timeslot=slot, user=request.user
                )
                slot.is_booked = True
                slot.save()
        except TimeSlot.DoesNotExist:
            raise Http404("Time slot not found.")
        serializer = BookingSerializer(booking, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookingDeleteView(generics.DestroyAPIView):
    """
    API endpoint for deleting an existing booking.

    Only the user who created the booking or a staff user can delete.
    Unbooks the slot atomically.
    """

    queryset = Booking.objects.select_related("timeslot")
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Delete the booking and release the associated time slot.

        Returns 204 No Content on success.
        Returns 403 Forbidden if the user is not allowed to delete the booking.
        """

        booking = self.get_object()
        if booking.user_id != request.user.id and not request.user.is_staff:
            return Response(
                {"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN
            )
        with transaction.atomic():
            slot = booking.timeslot
            slot.is_booked = False
            slot.save()
            booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
