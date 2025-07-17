# TODO

## 1. Error Handling & Notifications

* **NotificationService**: implement success and error message display (snackbars) in the frontend for operations such as creating categories, booking, canceling bookings, etc.
* **Backend Exception Handling**: handle additional exceptions in the API (e.g. `IntegrityError`, `ValidationError`) and return appropriate HTTP status codes (400, 409, 5xx) with descriptive error messages.

## 2. Documentation

* **Inline docs**: add comments and docstrings in the code (models, serializers, Angular services).
* **README.md**: update with descriptions of new features, notification handling instructions, and test scenarios.

## 3. Testing

* **Backend (pytest-django)**: write unit and integration tests for models, endpoints (especially booking conflict scenarios), and transactional logic, achieving ≥ 80% coverage.
* **Frontend (Jasmine/Karma)**: prepare unit tests for components, services, and NgRx effects, also targeting ≥ 80% coverage.

## 4. Time Zone Support

* **Dynamic Time Zone**: ensure that both backend and frontend correctly display and store dates/times in the user's local time zone (including DST).

## 5. Business Constraints & Validation

* **Slot Booking Limit**: allow a maximum of 2 bookings per `TimeSlot`.
* **Date Validation**: prevent creating bookings in the past (`start_dt < now`).

## 6. Real-time & Caching

* **Redis + Channels**: add Redis configuration to `docker-compose` and initial scaffolding for Django Channels to emit slot availability events in real time.
* **Frontend RTU**: initialize a `WebSocketSubject`/`ngx-socket-io` connection to receive events and dynamically update the calendar view.

## 7. UX for No Data & Expired Sessions

* **Fallback Views**: prepare alternative components (e.g. “No available slots”, “Session expired – please log in again”).
* **Auto-logout**: detect JWT expiration, clear application state, and redirect to the login page.

## 8. Further Improvements

* **Error Handling in Notes**: implement snackbars for errors in note-taking or additional feature modules.
* **Date Range Modes**: consider calendar display modes for:

  * weekdays only
  * weekends only
  * single-day view
* **Responsiveness**: optimize calendar and admin panel layouts for mobile/tablet.
* **Sticky Headers & Columns**: introduce fixed day/hour headers or switch to a `mat-table` for improved performance and built-in sorting/filtering.
