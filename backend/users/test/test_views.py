import jwt
import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.mark.django_db
class TestAuthViews:
    @pytest.fixture(autouse=True)
    def client(self):
        return APIClient()

    @pytest.fixture
    def register_url(self):
        return reverse("register")

    @pytest.fixture
    def token_url(self):
        return reverse("token_obtain_pair")

    @pytest.fixture
    def logout_url(self):
        return reverse("logout")

    @pytest.fixture
    def logout_all_url(self):
        return reverse("logout_all")

    def test_register_view_success(self, client, register_url):
        payload = {
            "username": "test1",
            "email": "test1@example.com",
            "password": "Test123!",
            "password2": "Test123!",
        }
        resp = client.post(register_url, payload, format="json")
        assert resp.status_code == 201
        assert User.objects.filter(username="test1").exists()

    def test_register_view_password_mismatch(self, client, register_url):
        payload = {
            "username": "test2",
            "email": "test2@example.com",
            "password": "Test123!",
            "password2": "Test1234!",
        }
        resp = client.post(register_url, payload, format="json")
        assert resp.status_code == 400
        assert "password2" in resp.data

    def test_token_obtain_includes_custom_claims(self, client, token_url):
        user = User.objects.create_user(username="test3", password="secret")
        resp = client.post(
            token_url,
            {"username": "test3", "password": "secret"},
            format="json",
        )
        assert resp.status_code == 200
        access = resp.data["access"]
        payload = jwt.decode(access, options={"verify_signature": False})
        assert payload["username"] == "test3"
        assert payload["is_staff"] is False

    def test_logout_without_refresh_returns_400(self, client, logout_url):
        user = User.objects.create_user(username="u1", password="pw")
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        resp = client.post(logout_url, {}, format="json")
        assert resp.status_code == 400
        assert "detail" in resp.data

    def test_logout_blacklists_token(self, client, logout_url):
        user = User.objects.create_user(username="u2", password="pw")
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        resp = client.post(
            logout_url, {"refresh": str(refresh)}, format="json"
        )
        assert resp.status_code == 205
        jti = refresh["jti"]
        assert BlacklistedToken.objects.filter(token__jti=jti).exists()

    def test_logout_all_blacklists_every_token(self, client, logout_all_url):
        user = User.objects.create_user(username="u3", password="pw")
        r1 = RefreshToken.for_user(user)
        r2 = RefreshToken.for_user(user)
        assert OutstandingToken.objects.filter(user=user).count() >= 2
        access = str(r1.access_token)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        resp = client.post(logout_all_url, {}, format="json")
        assert resp.status_code == 205
        total = OutstandingToken.objects.filter(user=user).count()
        assert (
            BlacklistedToken.objects.filter(token__user=user).count() == total
        )
