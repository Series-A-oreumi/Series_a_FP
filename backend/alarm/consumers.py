# myapp/consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
import json
from user.models import UserProfile

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # WebSocket 연결 시 호출되는 메서드
        # 여기서 사용자 정보를 가져와서 self.scope['user']에 할당

        await self.accept()  # 연결 수락

    async def disconnect(self, close_code):
        # WebSocket 연결이 종료될 때 호출되는 메서드
        pass

    async def receive(self, text_data):
        # WebSocket 클라이언트로부터 메시지를 수신할 때 호출되는 메서드
        text_data_json = json.loads(text_data)
        token = text_data_json.get('token')

        if token:
            # JWT 토큰에서 사용자 정보 디코드
            try:
                access_token = AccessToken(token)
                user_id = access_token.payload['user_id']

                # 사용자 정보 가져오기
                user = UserProfile.objects.get(id=user_id)
                self.scope['user'] = user  # 사용자 정보를 scope에 할당
            except AccessToken.DoesNotExist:
                pass  # 토큰이 없는 경우 무시
            except UserProfile.DoesNotExist:
                # 사용자를 찾을 수 없는 경우 연결을 거부할 수 있음
                await self.close()
