import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def send_notification(self, event):
        notification_message = event['message']

        # 메시지 전송
        await self.send(text_data=json.dumps({
            'message': notification_message
        }))