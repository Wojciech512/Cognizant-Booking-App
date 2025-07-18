import pytest
from django.contrib.auth.models import User
from users.serializers import UserRegisterSerializer


@pytest.mark.django_db
class TestUserRegisterSerializer:
    @pytest.fixture(autouse=True)
    def setup(self):
        User.objects.create_user(
            username="existing", email="E@example.com", password="pass"
        )

    @pytest.mark.parametrize(
        "email,valid",
        [
            ("new@example.com", True),
            ("e@EXAMPLE.com", False),
        ],
    )
    def test_validate_email_uniqueness(self, email, valid):
        data = {
            "username": "test",
            "email": email,
            "password": "Test123!",
            "password2": "Test123!",
        }
        serializer = UserRegisterSerializer(data=data)
        is_valid = serializer.is_valid()
        assert is_valid is valid
        if not valid:
            assert "email" in serializer.errors

    def test_passwords_must_match(self):
        data = {
            "username": "foo",
            "email": "foo@example.com",
            "password": "one",
            "password2": "two",
        }
        serializer = UserRegisterSerializer(data=data)
        is_valid = serializer.is_valid()
        assert not is_valid
        assert "password2" in serializer.errors

    def test_create_user_sets_password_and_flags(self):
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "secret123",
            "password2": "secret123",
        }
        serializer = UserRegisterSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        user = serializer.save()
        assert user.username == "newuser"
        assert user.email == "new@example.com"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.check_password("secret123")
