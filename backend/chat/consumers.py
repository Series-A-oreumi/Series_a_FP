from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from asgiref.sync import async_to_sync
class ChatConsumer(AsyncWebsocketConsumer):
    # 클라이언트가 WebSocket 연결을 시도할 때 호출되며,
    # 연결을 수락하고 그룹에 사용자를 추가합니다.
    users = {}
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']        
        self.room_group_name = f'chat_{self.room_name}'
        print(self.scope)

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
        # print(text_data_json)
        if text_data_json['type'] == "page_visible":
            
            chatroom_id = text_data_json['chatroom_id']
            user_id = text_data_json['sender']            
            
            # (데이터베이스) 메시지 -> '읽음'으로 업데이트
            await self.update_messages(chatroom_id, user_id)

            # room group에 이벤트 전달
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'read_message',
                }
            )
        else:   
            # print("뭐여")     
            message = text_data_json['message']
            chat_room_id = text_data_json['chat_room_id']
            chatroom = await self.get_chatroom(chat_room_id)  # chat_room_id를 ChatRoom 인스턴스로 변환
            sender = text_data_json['sender']
            receiver = text_data_json['receiver']
            await self.save_message(chatroom, sender, receiver, message)

            # self.users[receiver] = self.room_group_name

            # room group에 메시지 전달
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender' : sender,
                    'receiver' : receiver
                }
            )        
        
        # # 메시지를 다른 사용자에게 브로드캐스트합니다
        # await self.send(text_data=json.dumps({
        #     'message': message,
        #     'sender' : sender,
        #     'receiver' : receiver
        # }))
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        # sent_at = event['sent_at']

        await self.send(text_data=json.dumps({   
            'type' : 'chat_message',         
            'message': message,
            'sender': sender,                
        }))
    # 메시지가 '읽음' 처리되었음을 알리기 위해 호출됩니다.
    async def read_message(self, event):
        print("읽")
    


    @database_sync_to_async
    def save_message(self, chatroom_id, sender_id, receiver_id, message):
        Message.objects.create(chatroom=chatroom_id, sender=sender_id, receiver=receiver_id, content=message)

    @database_sync_to_async        
    def get_chatroom(self, chatroom_id):
        return ChatRoom.objects.get(id=chatroom_id)
    
    @database_sync_to_async
    def update_messages(self, chatroom_id, user_id):
        messages = Message.objects.filter(chatroom=chatroom_id, receiver=user_id)
        messages.update(is_read=True)

        async_to_sync(self.channel_layer.group_send)('your_group_name', {
        'type': 'chat.message',
        'receiver': user_id,
        'message': True,  # 또는 다른 메시지
        'chatroom_id': chatroom_id
        })





class Chat_alarm(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['room_name']                
        # WebSocket 연결 설정
        await self.accept()
        await self.channel_layer.group_add('your_group_name', self.channel_name)

    async def disconnect(self, close_code):
        # WebSocket 연결 해제
        await self.channel_layer.group_discard('your_group_name', self.channel_name)

    # async def receive(self, text_data):
    #     text_data_json = json.loads(text_data)  
    #     # print(text_data_json['sender'])
    #     self.username = text_data_json['sender']
        

    async def chat_message(self, event):                  
        reciever = event['receiver']
        message = event['message']
        chatroom_id = event['chatroom_id']        
        if self.username == reciever:
            print(message)
            if message == False:
                count = 1                
                await self.send(text_data=json.dumps({
                    "count" : count,
                    "chatroom_id" : chatroom_id
                }))
            else:
                    count = 0
                    await self.send(text_data=json.dumps({
                        "count" : count,
                        "chatroom_id" : chatroom_id
                    }))
                    print("읽음")
                

        # else:
            # count = 0
            # await self.send(text_data=json.dumps({
            #     "count" : count,
            #     "chatroom_id" : chatroom_id
            # }))
            # print("읽음")
        
        
        
