# CognizantBookingApp

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Pre-commit Setup](#pre-commit-setup)
3. [Architecture](#architecture)
   - [Frontend (Angular 17 + NgRx)](#frontend-angular-17--ngrx)
   - [Backend (Django 5 + Django REST Framework)](#backend-django-5--django-rest-framework)
        - [Database (PostgreSQL 16)](#database-postgresql-16)
        - [Docker & Deployment](#docker--deployment)

4. [Planned Enhancements](#planned-enhancements)

---

CognizantBookingApp is a full-stack event booking application that lets users browse and book available time slots in a weekly calendar view. It is built with an Angular 19 [frontend](./frontend/package.json) (using Angular Material UI components and NgRx for state management) and a Django 5 [backend](./backend/requirements.txt) (Django REST Framework API). The system is containerized with Docker for easy setup and uses a PostgreSQL 16 database to persist event data and bookings.

This README provides an overview of the project, instructions to run it with Docker, an explanation of the architecture, testing methods, and planned enhancements.

---

## Quick Start

Follow these steps to build and run the application using Docker and docker-compose:

### 1. Clone the repository and navigate into it:

```bash
git clone <repo-url>
cd <repo-directory>
#optional step if want to develop this app
pip install pre-commit
pre-commit install
```

### 2. Run Docker Compose to build the images and start the containers:

```bash
docker-compose up --build
```

This command will download/build the Docker images and launch four containers:

- **PostgreSQL 16 database**
- **Django backend**
- **Angular frontend**
- **Redis** (for future use)

The first run may take a few minutes as dependencies are installed.

### 3. Access the application in your browser once all services are up (Docker will output logs for each container):

- **Frontend Angular app**: `http://localhost:4200` (the user interface)
- **Backend Django API**: `http://localhost:8000` (the REST API, e.g. browse `http://localhost:8000/api/health/` for a health check)

### 4. Log in or register

The web app requires authentication. You can register a new user account via the Sign-Up page or use the default admin account that is created on startup. The default credentials are:

- **Username**: `userAdmin`
- **Password**: `Test123!`

Using this account (which is a staff admin user) will allow access to the admin features of the app.

> **Note:** On first launch, the backend container runs database migrations and seeds initial data. It will [create a superuser account](./backend/core/management/commands/create_superuser.py) and some [default event categories](./backend/event_scheduler/migrations/0002_add_default_categories.py) automatically. The Angular dev server is configured to proxy API calls to the backend (via Docker network or host forwarding), so all frontend interactions (login, viewing calendar, booking slots) will communicate with the Django API seamlessly.

---

## Pre-commit Setup

This project runs the following tools on each `git commit`:

- **Black** (Python formatter, `line-length = 78` in `pyproject.toml`)
- **isort** (Python import sorter, Black profile in `pyproject.toml`)
- **Flake8** (Python linter, max-line-length = 78 in `backend/.flake8`)
- **Prettier** (JS/TS/CSS/JSON/MD formatter, project defaults)
- **ESLint** (JS/TS linter, project’s ESLint config, `--max-warnings=0`)

### Enable

```bash
pip install pre-commit
pre-commit install
```

### Disable

```bash
pre-commit uninstall
pre-commit clean
```

---

## Architecture

CognizantBookingApp is organized into a client–server architecture with a clearly separated frontend and backend, communicating over a RESTful HTTP API. The high-level design is as follows:

### Frontend (Angular 19 + NgRx)

- **Single-page Angular application** using Angular Material for responsive UI components and NgRx for state management.
- **Modular codebase**:
  - `src/app/core/` – Core services and utilities loaded once (e.g., AuthInterceptor, global configs).
  - `src/app/shared/` – Shared components, pipes, and helpers (e.g., custom pipes for filtering and color-coding categories).
  - `src/app/features/` – Feature modules:
    - **Auth** (`features/auth/`): Login, Registration components, route guards, JWT handling.
    - **Calendar** (`features/calendar/`): Weekly grid of time slots, filtering, booking/cancellation, NgRx selectors & effects.
    - **Admin** (`features/admin/`): Staff-only panel for managing time slots and categories.
    - **Preferences** (`features/preferences/`): Placeholder for user settings (time zone, notifications).

- **NgRx Store**: Feature slices for authentication, categories, time slots, bookings; effects for API calls.
- **Communication**: Angular `HttpClient` calls to `/api/...` endpoints, proxied via `environment.apiUrl`.

### Backend (Django 5 + Django REST Framework)

- **Django project** exposing a REST API.
- **Apps**:
  - **Event Scheduler** (`event_scheduler/`): Models `EventCategory`, `TimeSlot` (UUID, start/end, category, is_booked).
  - **Bookings** (`bookings/`): Model `Booking` (OneToOne to `TimeSlot`, FK to `User`).
  - **Users** (`users/`): Registration, JWT auth via `djangorestframework-simplejwt`.

- **Endpoints**:
  - `/api/event_scheduler/categories/` – GET (list), POST (create).
  - `/api/event_scheduler/timeslots/` – GET (list/filter), POST (create), DELETE (remove).
  - `/api/bookings/` – POST (book slot), DELETE (cancel booking).
  - `/api/users/` – POST `register/`, `token/` (login), `logout/`.
  - **Admin site** at `/admin/`.

- **Transactional booking logic** using `select_for_update()` to enforce single booking per slot and return HTTP 409 on conflicts.

### Database (PostgreSQL 16)

- **Persistent storage** in a Dockerized PostgreSQL 16 container.
- **Django ORM** migrations on first run to set up schema and seed default categories.
- **Named volume** for data persistence across restarts.

### Docker & Deployment

- **Services** in `docker-compose.yml`:
  - `db` – `postgres:16-alpine` with env vars and volume.
  - `redis` – `redis:7-alpine` (future Channels support).
  - `backend` – Multi-stage build (`python:3.11-slim` → `python:3.11-alpine`), runs migrations, creates superuser, serves via Gunicorn.
  - `frontend` – Multi-stage Angular build (`node:18-alpine` → `nginx:alpine`), serves static files.

- **Networking** on a shared Docker network for inter-service communication.
- **Healthchecks** for orchestrated startup.

---

## Planned Enhancements

- **Real-time Slot Updates**: Integrate Django Channels + Redis and `ngx-socket-io` for live booking notifications.
- **Time Zone Handling**: Store times in UTC, allow user-selected display zones.
- **Admin UI & UX Improvements**: Edit/delete categories, modify slots, booking analytics dashboard.
- **Additional Validation Rules**: Prevent past slot creation, overlapping bookings, enforce lead times.
- **Testing, CI, Quality Gates**: Increase test coverage to ≥80%, add GitHub Actions, implement feature flags for safe rollouts.

---

_© 2025 CognizantBookingApp contributor_
