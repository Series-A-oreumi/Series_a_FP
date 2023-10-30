from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import ChatRoom, Message

class ChatConsumer(AsyncWebsocketConsumer):
    # 클라이언트가 WebSocket 연결을 시도할 때 호출되며,
    # 연결을 수락하고 그룹에 사용자를 추가합니다.
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']        
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    # 클라이언트가 WebSocket 연결을 해제할 때 호출되며,
    # 그룹에서 사용자를 제거합니다.
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data)
        message = text_data_json['message']
        chat_room_id = text_data_json['chat_room_id']
        chatroom = await self.get_chatroom(chat_room_id)  # chat_room_id를 ChatRoom 인스턴스로 변환
        sender = text_data_json['sender']
        receiver = text_data_json['receiver']
        await self.save_message(chatroom, sender, receiver, message)
        
        # 메시지를 다른 사용자에게 브로드캐스트합니다
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def save_message(self, chatroom_id, sender_id, receiver_id, message):
        Message.objects.create(chatroom=chatroom_id, sender=sender_id, receiver=receiver_id, content=message)

    @database_sync_to_async        
    def get_chatroom(self, chatroom_id):
        return ChatRoom.objects.get(id=chatroom_id)
