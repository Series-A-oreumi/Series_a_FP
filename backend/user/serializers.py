from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

# userprofile
class UserProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserProfile
        exclude = ['password', 'created_at']

# userprofile update
class ProfileUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserProfile
        fields = ['username', 'nickname', 'info']


# login
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
                    token_data = user.get_token()
                    refresh = token_data['refresh']
                    access = token_data['access']

                    data = {
                        'user': user,
                        'refresh': refresh,
                        'access': access,
                    }

                    return data
                else:
                    raise serializers.ValidationError("비밀번호가 일치하지 않습니다.")
            else:
                raise serializers.ValidationError("사용자가 존재하지 않습니다.")

        
    class Meta:
        model = UserProfile
        fields = ["email", "password"]

# register
class RegistrationSerializer(serializers.ModelSerializer):
    BOOTCAMP_CHOICES = (
        ('백엔드 1기', '백엔드 오르미 1기'),
        ('백엔드 2기', '백엔드 오르미 2기'),
        ('백엔드 3기', '백엔드 오르미 3기'),
        ('AI 1기', 'AI WASSUP 1기'),
    )

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=UserProfile.objects.all())],
    )
    username = serializers.CharField(
        max_length=30, 
        required=True
        )
    password = serializers.CharField(
        min_length=8, 
        write_only=True, 
        required=True,
        )
    password2 = serializers.CharField(
        min_length=8, 
        write_only=True, 
        required=True)
    nickname = serializers.CharField(
        max_length=255, 
        validators=[UniqueValidator(queryset=UserProfile.objects.all())]
        )
    bootcamp = serializers.ChoiceField(
        required=True,
        choices=BOOTCAMP_CHOICES
        )


    class Meta:
        model = UserProfile
        fields = ("email", "password", "password2", "username", "nickname", "bootcamp")
    
    def create(self, validated_data):
        validated_data.pop("password2") # UserProfile 모델에 password2라는 필드가 따로 없고 확인용이기에 pop
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

   
