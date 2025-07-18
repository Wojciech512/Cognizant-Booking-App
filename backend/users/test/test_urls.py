from django.urls import resolve, reverse
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import LogoutAllView, LogoutView, RegisterUserView


def test_token_refresh_route_resolves():
    path = reverse("token_refresh")
    assert resolve(path).func.view_class == TokenRefreshView


def test_register_route_resolves():
    path = reverse("register")
    assert resolve(path).func.view_class == RegisterUserView


def test_logout_route_resolves():
    path = reverse("logout")
    assert resolve(path).func.view_class == LogoutView


def test_logout_all_route_resolves():
    path = reverse("logout_all")
    assert resolve(path).func.view_class == LogoutAllView
