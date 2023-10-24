from django.http import JsonResponse
from django.shortcuts import render

from .models import *
from .forms import *
from .serializers import *

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


from rest_framework.authtoken.models import Token

class UserProfileView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    queryset = UserProfile.objects.all()

    def get_object(self):
        return self.request.user
    
class LoginView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get("user")  # 유저 객체 가져오기
            refresh = serializer.validated_data.get("refresh")
            access = serializer.validated_data.get("access")
            
            user_info = UserProfileSerializer(user)

            data = {
                'user': user_info.data,
                'refresh': refresh,
                'access': access,
            }
            
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# 로그아웃은 프론트에서 jwt 토근 삭제하는 방법이 훨씬 나을듯!
# class LogoutView(APIView):
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         request.user.auth_token.delete()
#         return Response(status=status.HTTP_200_OK)

class RegisterView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

            # return Response(serializer.data)
        else:
            return Response(serializer.errors)

