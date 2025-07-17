from django.contrib.auth.models import User
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.

    Handles validation and creation of new User instances, including
    password confirmation and unique email constraint.
    """

    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    password2 = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2"]

    def validate_email(self, value):
        """
        Ensure that the provided email is unique (case-insensitive).
        Raises:
            serializers.ValidationError: If the email is already in use.
        """
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email address is already taken."
            )
        return value

    def validate(self, data):
        """
        Ensure that both entered passwords match.

        Raises:
            serializers.ValidationError: If passwords do not match.
        """
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(
                {"password2": "Passwords must match."}
            )
        return data

    def create(self, validated_data):
        """
        Create and return a new User instance with the provided, validated data.

        The user is created as active and non-staff by default.
        Password2 is removed from validated_data before saving.
        """
        validated_data.pop("password2")
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            is_active=True,
            is_staff=False,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
