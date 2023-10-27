from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    # user register & login
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),

    # userprofile
    path('profile/', ProfileUpdateDelete.as_view()), # update & delete
    path('profile/<int:user_id>/', ProfileDetail.as_view()), # detail


    # jwt-token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # 토큰 재발급을 위한 url
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]