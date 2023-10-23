from django.contrib.auth.models import User
from django.conf import settings
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField(max_length=255)
    bootcamp = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.email} Profile'

    def token(self):
        refresh = RefreshToken.for_user(self)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }