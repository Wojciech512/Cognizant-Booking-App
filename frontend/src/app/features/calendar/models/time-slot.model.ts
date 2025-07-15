export interface TimeSlot {
  id: string;
  start_dt: string;
  end_dt: string;
  is_booked: boolean;
  category: number;
  booked_by_current_user?: boolean;
  my_booking_id?: number;
}
