from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'nickname', 'bootcamp']

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(min_length=8)
    password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = UserProfile.objects.filter(email=email).first()
            if user:
                if user.password == password:
                    return user
                else:
                    raise serializers.ValidationError("Incorrect password")
            else:
                raise serializers.ValidationError("User does not exist")

    class Meta:
        model = UserProfile
        fields = ["email", "password"]

class RegistrationSerializer(serializers.ModelSerializer):
    BOOTCAMP_CHOICES = (
        ('백엔드 1기', '백엔드 오르미 1기'),
        ('백엔드 2기', '백엔드 오르미 2기'),
        ('백엔드 3기', '백엔드 오르미 3기'),
        ('AI 1기', 'AI WASSUP 1기'),
    )

    email = serializers.EmailField(min_length=8, write_only=True)
    username = serializers.CharField(max_length=30)
    password = serializers.CharField(min_length=8, write_only=True)
    password2 = serializers.CharField(min_length=8, write_only=True)
    nickname = serializers.CharField(max_length=255)
    bootcamp = serializers.ChoiceField(choices=BOOTCAMP_CHOICES)

    def create(self, validated_data):
        validated_data.pop("password2")
        user = UserProfile.objects.create(**validated_data)
        return user

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")

        if password != password2:
            raise serializers.ValidationError("Passwords must match")
        return attrs

    class Meta:
        model = UserProfile
        fields = ("email", "password", "password2","username", "nickname", "bootcamp")
