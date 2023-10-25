from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfile(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    nickname = models.CharField(max_length=255)
    bootcamp = models.CharField(max_length=255)

    def __str__(self):
        return self.nickname

    def get_token(self):
        refresh = RefreshToken.for_user(self)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }