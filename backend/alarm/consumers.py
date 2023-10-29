# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.authtoken.models import Token
from alarm.models import Alarm
from alarm.serializers import AlarmSerializer
from user.serializers import UserProfileSerializer
from user.models import UserProfile  # 사용자 모델 임포트

# const token = "your_jwt_token_here"; // 획득한 JWT 토큰
# const socket = new WebSocket("ws://your_websocket_server_url?token=" + token);
class MyConsumer(AsyncWebsocketConsumer):

     # 클라이언트가 WebSocket 연결을 시도할 때 호출되며, 연결을 수락하고 그룹에 사용자를 추가합니다.
    async def connect(self):
        
        # WebSocket 연결 시 클라이언트로부터 토큰을 받아옴
        # token = self.scope.get('query_string').decode('utf-8').split('=')[1]
        token = self.scope.get('url_route')['kwargs']['token']

        # 토큰 유효성 검사 및 사용자 인증
        user = await self.get_user_from_token(token)

        # 로그인 된 유저이면 (정상적인 유저면)
        if user:
            self.scope["user"] = user

            self.user_id = user.id
            self.user_group_name = f'alarm_{self.user_id}'


        else: # 로그인 된 유저가 아니거나 정상적인 유저가 아니라면
            await self.close()
        
        # 룸 그룹 생성
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()
        
    # 클라이언트가 WebSocket 연결을 해제할 때 호출되며, 그룹에서 사용자를 제거합니다.
    async def disconnect(self, close_code):
        # 룸 그룹 나가기
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
    
    # 클라이언트로부터 메시지를 받을 때 호출되며, 받은 메시지를 그룹 내의 모든 클라이언트에 전송합니다.
    async def alarm(self, event):
        message = event['message']
        # 웹소켓으로 메세지 보냄
        await self.send(text_data=json.dumps({
            'message': message,
        }))

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            # 토큰 디코드
            access_token = AccessToken(token)
            user_id = access_token.payload['user_id']
            user = UserProfile.objects.get(id=user_id)
            return user
        except UserProfile.DoesNotExist:
            return None

@receiver(post_save, sender=Alarm)
def alarm_post_save(sender, instance, **kwargs):
    alarms = Alarm.objects.filter(receiver=instance.receiver, is_check=False)

    alarms_info = []
    for alarm in alarms:
        alarm_serializer = AlarmSerializer(alarm)
        user_serializer = UserProfileSerializer(alarm.sender)

        alarm_info = {
            'alarms': alarm_serializer.data,
            'sender': user_serializer.data
        }
        
        alarms_info.append(alarm_info)
    
    channel_layer = get_channel_layer()

    async def send_notification():
        await channel_layer.group_send(f'alarm_{instance.receiver.id}', {
            'type': 'alarm',
            'message': alarms_info,
        })

    # 비동기 함수를 동기식으로 실행
    async_to_sync(send_notification)()