from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfile(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    nickname = models.CharField(max_length=255)
    bootcamp = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nickname

    def get_token(self):
        refresh = RefreshToken.for_user(self)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    
# class Profile(models.Model):
#     user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
#     profile_img = models.ImageField(upload_to='profile_images/', blank=True, null=True)
#     about = models.TextField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)