from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserRegisterSerializer


class RegisterUserView(generics.CreateAPIView):
    """
    API endpoint for registering a new user.

    Accepts POST requests with user data and returns the created user instance.
    """

    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


class AppTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to include extra fields in the JWT payload.

    Adds 'is_staff' and 'username' fields to the generated token.
    """

    @classmethod
    def get_token(cls, user):
        """
        Generate a JWT token for the given user with custom claims.
        """
        token = super().get_token(user)
        token["is_staff"] = user.is_staff
        token["username"] = user.username
        return token


class AppTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token obtain view using AppTokenObtainPairSerializer.

    Returns access and refresh tokens with custom claims.
    """

    serializer_class = AppTokenObtainPairSerializer


class LogoutView(APIView):
    """
    API endpoint for logging out a single session.

    Blacklists the provided refresh token to invalidate the session.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Blacklist the given refresh token.

        Returns 205 Reset Content on success.
        Returns 400 Bad Request if no refresh token is provided.
        """
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."}, status=400
            )
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logged out successfully."}, status=205)


class LogoutAllView(APIView):
    permission_classes = (IsAuthenticated,)
    """
    API endpoint for logging out all user sessions.

    Blacklists all outstanding tokens for the current authenticated user.
    """

    def post(self, request):
        """
        Blacklist all outstanding tokens for the requesting user.

        Returns 205 Reset Content after successful logout from all sessions.
        """
        tokens = OutstandingToken.objects.filter(user=request.user)
        for t in tokens:
            BlacklistedToken.objects.get_or_create(token=t)
        return Response({"detail": "All sessions logged out."}, status=205)
