from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import NotificationSerializer
from .models import *
import logging
from user.permissions import IsTokenValid

logger = logging.getLogger(__name__)

# Create your views here.
class NotificationCreateAPIView(APIView):

    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    def post(self, request):
        content = request.data.get('content')
        notification = Notification(content=content)
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self,request):
        notifications = Notification.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CommentCreateAPIView(APIView):

    permission_classes = [IsTokenValid]
    def post(self, request, study_id):
        # 댓글 생성 코드 (이미 가지고 있음)

        # 알림 생성 및 저장
        notification_content = '새로운 댓글이 달렸습니다!'
        notification = Notification(content=notification_content, study_id=study_id)
        notification.save()

        # 알림 정보를 클라이언트에게 반환
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        