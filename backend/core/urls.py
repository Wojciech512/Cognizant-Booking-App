from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    AppTokenObtainPairView,
    LogoutAllView,
    LogoutView,
    RegisterUserView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/token/",
        AppTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),
    path("api/register/", RegisterUserView.as_view(), name="register"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/logout_all/", LogoutAllView.as_view(), name="logout_all"),
]
