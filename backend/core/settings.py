"""
Django settings for the event booking application.

This configuration module provides centralized settings for the Django backend, with the following scope and architectural context:

- **Project context:**
  The Django backend is part of a monorepo (Angular 19 + Django 5 + PostgreSQL 16), containerized using Docker and orchestrated via docker-compose. The backend exposes a REST API, handles transactional bookings, and is ready for future real-time updates using Django Channels and Redis. All sensitive credentials and deployment-specific values are managed via environment variables (.env file), following the twelve-factor app methodology.

- **Core configuration areas:**
    * **Project structure:** Defines absolute project paths and static file locations for consistent deployment in both local and containerized environments.
    * **Environment management:** Loads and validates secrets and configuration from environment variables using the `environ` library. Secrets (e.g., SECRET_KEY) and database credentials must be set externally for each environment (dev, staging, production).
    * **Installed applications:** Enables Django core apps, REST framework (with JWT authentication and token blacklisting), CORS, and channels (for future WebSocket support). The project includes custom domain apps for event scheduling and transactional booking logic.
    * **Middleware stack:** Configures the middleware chain for security, CORS handling, session management, CSRF protection, authentication, messaging, and clickjacking prevention.
    * **Templates:** Uses Django templates with context processors for authentication and messaging. Template directory is resolved relative to the project root for compatibility with Docker volumes.
    * **Application entrypoints:** Declares both WSGI and ASGI applications. WSGI is used for standard HTTP traffic (Gunicorn in production), while ASGI enables future support for WebSocket and async features (Channels).
    * **Database:** Connects to a PostgreSQL instance. Connection parameters are injected from environment variables, ensuring compatibility with Docker networking (e.g., service names as DB hosts). The backend expects a dedicated database per environment.
    * **Channels (optional, RTU-ready):** Pre-configures a Redis-backed channel layer for real-time features. The Redis host is set via environment variables and defaults to the Docker Compose service name ("redis"). This does not affect HTTP performance and is ready for activation upon implementing real-time updates.
    * **REST framework and JWT:** Sets up REST Framework with JWT authentication as default (via `rest_framework_simplejwt`). All API endpoints require authentication by default (can be overridden at the view level). JWT lifetimes are configurable via environment variables.
    * **CORS:** In development, all origins are allowed. This should be restricted for production deployments.
    * **Localization:** Sets English (US) as the default language, with the time zone set to Europe/Warsaw. Timezone-aware datetimes and internationalization are enabled.
    * **Static files:** Serves static assets from a dedicated directory, supporting collectstatic and static file hosting in Dockerized environments (e.g., Nginx, WhiteNoise).
    * **Primary key field:** Uses `BigAutoField` as the default for primary keys in all models, ensuring compatibility and scalability for large datasets.

- **Security and best practices:**
    * All secrets and critical settings (SECRET_KEY, database credentials, allowed hosts, JWT lifetimes) must be managed through environment variables. Never hardcode secrets in the repository.
    * CORS and DEBUG must be reviewed and adjusted before deploying to production.
    * Database migrations and user management (superuser creation) should be performed via CLI within the Docker container, not in code.
    * All apps and packages should be kept up to date to address security vulnerabilities.
    * Transactional integrity for booking is enforced at the database and API layer (see project docs).
"""

import os
from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "channels",
    "core",
    "event_scheduler",
    "bookings",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB"),
        "USER": env("POSTGRES_USER"),
        "PASSWORD": env("POSTGRES_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}

REDIS_HOST = env("REDIS_HOST", default="redis")

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOST, 6379)],
        },
    },
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

ACCESS_TOKEN_LIFETIME = env.int("ACCESS_TOKEN_LIFETIME", default=60)
REFRESH_TOKEN_LIFETIME = env.int("REFRESH_TOKEN_LIFETIME", default=1)

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=ACCESS_TOKEN_LIFETIME),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=REFRESH_TOKEN_LIFETIME),
}

CORS_ALLOW_ALL_ORIGINS = True

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Warsaw"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
