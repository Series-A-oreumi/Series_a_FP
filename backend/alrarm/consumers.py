import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from asgiref.sync import async_to_sync


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["url_route"]["kwargs"]["user"]
        self.user_group_name = f"user_{self.user}"
        print("connect complete")
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

    async def send_notification(self, event):
        notification_message = event["message"]
        notification_type = "notify"  # 메시지 타입을 지정합니다.
        print("noti complete")

        # 메시지 전송
        await self.send(
            text_data=json.dumps({"type": "notification_type", "message": notification_message})
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received message:", text_data)
        if "user_id" in data and "message" in data and "created_at" in data:
            user_id = data["user_id"]
            message = data["message"]
            created_at = data["created_at"]
            count = data.get("count", 0)

            async_to_sync(self.channel_layer.group_send)(
                self.groupname,
                {
                    "type": "share_message",
                    "count": count,
                    "message": message,
                    "created_at": created_at,
                },
            )

            await self.send(
                text_data=json.dumps({"message": data["message"]})  # 저장된 메시지를 다시 클라이언트에게 전송
            )
        else:
            print("Required fields are missing")

            # study_id를 사용하여 Notification 모델에 저장
            if user_id:
                Notification.objects.create(study_id=user_id, content=message)

    def share_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))

    def notify(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps(event))
