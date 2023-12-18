import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notifications
from asgiref.sync import async_to_sync


class NotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 사용자가 웹소켓에 연결되면 모든 사용자에게 알림을 전송합니다.
        self.user_group_name = "all_users"

        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        await self.accept()
    # async def connect(self):
    #     self.user = self.scope["url_route"]["kwargs"]["user"]
    #     self.user_group_name = f"user_{self.user}"
    #     print("connect complete")
    #     await self.channel_layer.group_add(self.user_group_name, self.channel_name)
    #     await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

    async def send_notification(self, event):
        notification_message = event["message"]
        notification_type = event.get("type", "notification")  # 이벤트에서 타입을 동적으로 가져옴
        print("noti complete")

        # 메시지 전송
        await self.send(
            text_data=json.dumps({"type": "notification_type", "message": notification_message})
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received message:", text_data)
        if "user_id" in data and "category_likecomment" in data and "created_at" in data:
            user_id = data["user_id"]
            category_likecomment = data["category_likecomment"]
            created_at = data["created_at"]
            count = data.get("count", 0)

         # 저장 로직 추가
            try:
                Notifications.objects.create(user_id=user_id, category_likecomment=category_likecomment, created_at=created_at)
                print("Notification saved successfully")
            except Exception as e:
                print("Error saving notification:", str(e))

            async_to_sync(self.channel_layer.group_send)(
                self.groupname,
                {
                    "type": "share_message",
                    "count": count,
                    "category_likecomment": category_likecomment,
                    "created_at": created_at,
                },
            )

            await self.send(
                text_data=json.dumps({"message": data["message"]})  # 저장된 메시지를 다시 클라이언트에게 전송
            )
        else:
            print("Required fields are missing")

    async def alarm(self, event):
        message = event['message']
        # 웹소켓으로 메세지 보냄
        await self.send(text_data=json.dumps({
            'message': message,
        }))