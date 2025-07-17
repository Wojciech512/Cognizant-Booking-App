from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    AppTokenObtainPairView,
    LogoutAllView,
    LogoutView,
    RegisterUserView,
)

routers = routers.SimpleRouter()

# URL routing for user authentication endpoints.
urlpatterns = [
    path(
        "token/",
        AppTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("logout_all/", LogoutAllView.as_view(), name="logout_all"),
]

urlpatterns += routers.urls
