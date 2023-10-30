from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import NotificationSerializer
from .models import *

# Create your views here.
class NotificationCreateAPIView(APIView):
    def post(self, request):
        content = request.data.get('content')
        notification = Notification(content=content)
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CommentCreateAPIView(APIView):
    def post(self, request, study_id):
        # 댓글 생성 코드 (이미 가지고 있음)

        # 알림 생성 및 저장
        notification_content = '새로운 댓글이 달렸습니다!'
        notification = Notification(content=notification_content)
        notification.save()

        # 알림 정보를 클라이언트에게 반환
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)