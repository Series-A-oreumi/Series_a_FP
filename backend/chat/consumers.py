from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async

from alarm.models import Alarm
from user.models import UserProfile
from .models import ChatRoom, Message
from asgiref.sync import async_to_sync
import urllib.parse


class ChatConsumer(AsyncWebsocketConsumer):

    users = {}
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']        
        self.room_group_name = f'chat_{self.room_name}'
        
        user_data = self.scope.get('query_string')
        decoded_user_data = urllib.parse.unquote(user_data.decode())
        
        user_custom_data = json.loads(decoded_user_data)
        sender = user_custom_data['sender']
        self.receiver = user_custom_data['receiver']        
       
        if self.receiver not in self.users:
            self.users[self.receiver] = self.room_group_name
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
    
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        del self.users[self.receiver]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)  
    
        if text_data_json['type'] == "page_visible":            
            
            chatroom_id = text_data_json['chatroom_id']
            sender_nickname = text_data_json['sender']            
            
            # (데이터베이스) 메시지 -> '읽음'으로 업데이트
            await self.update_messages(chatroom_id, sender_nickname)

            # room group에 이벤트 전달
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'read_message',
                }
            )
        else:                           
            sender_nickname = text_data_json['sender']  
          
            if sender_nickname in self.users:
                
                message = text_data_json['message']
                chat_room_id = text_data_json['chat_room_id']
                chatroom = await self.get_chatroom(chat_room_id)  # chat_room_id를 ChatRoom 인스턴스로 변환
                sender = text_data_json['sender']
                receiver = text_data_json['receiver']
                is_read = True
                await self.save_message(chatroom, sender, receiver, message, is_read)
            

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
            else:                    
                message = text_data_json['message']
                chat_room_id = text_data_json['chat_room_id']
                chatroom = await self.get_chatroom(chat_room_id)  # chat_room_id를 ChatRoom 인스턴스로 변환
                sender = text_data_json['sender']
                receiver = text_data_json['receiver']
                is_read = False
                await self.save_message(chatroom, sender, receiver, message, is_read)
            

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
       
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({   
            'type' : 'chat_message',         
            'message': message,
            'sender': sender,                
        }))
        
    # 메시지가 '읽음' 처리되었음을 알리기 위해 호출.
    async def read_message(self, event):
        print("읽")
    

    @database_sync_to_async
    def save_message(self, chatroom_id, sender_id, receiver_id, message, is_read):
        Message.objects.create(chatroom=chatroom_id, sender=sender_id, receiver=receiver_id, content=message, is_read=is_read)

        sender_user = UserProfile.objects.get(nickname=sender_id)
        receiver_user = UserProfile.objects.get(nickname=receiver_id)

        # 알람 생성 및 저장
        content = f'{sender_id}님이 메시지를 보냈습니다.'  # 알람 내용 생성
        alarm = Alarm.objects.create(sender=sender_user, receiver=receiver_user, content=content)
    
    @database_sync_to_async        
    def get_chatroom(self, chatroom_id):
        return ChatRoom.objects.get(id=chatroom_id)
    
    @database_sync_to_async
    def update_messages(self, chatroom_id, sender_nickname):
        messages = Message.objects.filter(chatroom=chatroom_id, receiver=sender_nickname)
        messages.update(is_read=True)
        
        async_to_sync(self.channel_layer.group_send)('your_group_name', {
        'type': 'chat.message',
        'receiver': sender_nickname,
        'message': True,  
        'chatroom_id': chatroom_id
        })


class Chat_alarm(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['room_name']                

        await self.accept()
        await self.channel_layer.group_add('your_group_name', self.channel_name)


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('your_group_name', self.channel_name)


    async def chat_message(self, event):                  
        reciever = event['receiver']
        message = event['message']
        chatroom_id = event['chatroom_id']        
        if self.username == reciever:

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
                   
        
        
        
