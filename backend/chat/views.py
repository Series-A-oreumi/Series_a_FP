from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from user.utils import get_user_from_token, S3ImgUploader
from rest_framework import status
from user.serializers import UserProfileSerializer
from user.permissions import IsTokenValid  # 커스텀 권한 클래스 임포트
from .models import *
from user.models import UserProfile
from django.db.models import Q
from .serializers import MessageSerializer
import openai

openai.api_key = "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"

class Chat_AI(APIView):    
    permission_classes = [IsTokenValid]
    
    def post(self, request):        
               
        try:  
            prompt = request.data.get('title')
                               
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
            )
            
            message = response["choices"][0]["message"]["content"]
            print(message)
                     
            message = {
                "message": message
            }                        
            return Response(message, status=status.HTTP_200_OK)  
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 
class ChatList(APIView):    
    permission_classes = [IsTokenValid]
    
    def get(self, request):        
        try:            
            login_nickname = get_user_from_token(request)                             

            login_user_info = UserProfileSerializer(login_nickname)                        
            message = {
                "user": login_user_info.data
            }                        
            return Response(message , status=status.HTTP_200_OK)  
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 

class CreateChatroom(APIView):
    permission_classes = [IsTokenValid]

    def post(self, request):
        try:
            request_user = get_user_from_token(request)

            if request.data.get('guest'):
                guest = request.data.get('guest')
                guest_user = UserProfile.objects.get(nickname=guest)

                if guest_user != request_user:  
                    host = UserProfile.objects.get(nickname=request_user.nickname)
                    host_id = host.id

                    chatroom = ChatRoom.objects.filter(
                        Q(chat_host=host.nickname, chat_guest=guest_user.nickname) | Q(chat_host=guest_user.nickname, chat_guest=host.nickname)
                    ).first()
                    
                    if chatroom is None:
                        chatroom = ChatRoom.objects.create(
                            chat_host=host.nickname, chat_guest=guest_user.nickname, nickname_id=host_id
                        )
                    

                    chatrooms_context = self.get_chatrooms_context(host)

                    return Response(chatrooms_context, status=status.HTTP_200_OK)
                else:
                    host = UserProfile.objects.get(nickname=request_user)
                    chatrooms_context = self.get_chatrooms_context(host)
                    return Response(chatrooms_context, status=status.HTTP_200_OK)
            else:
                host = UserProfile.objects.get(nickname=request_user)
                chatrooms_context = self.get_chatrooms_context(host)

                return Response(chatrooms_context, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e), status=status.HTTP_404_NOT_FOUND)

    def get_chatrooms_context(self, host):
        chatrooms = ChatRoom.objects.filter(Q(chat_host=host.nickname) | Q(chat_guest=host.nickname))
        chatrooms_context = []

        for chatroom in chatrooms:
            if chatroom.chat_host == host.nickname:
                chat_partner = UserProfile.objects.get(nickname=chatroom.chat_guest)
            else:
                chat_partner = UserProfile.objects.get(nickname=chatroom.chat_host)

            unread_chatrooms = Message.objects.filter(receiver=host.id, is_read=False, chatroom_id=chatroom.id)
            unread_count = unread_chatrooms.count()

            partner_profile_img = UserProfile.objects.get(nickname=chatroom.chat_guest).profile_img

            if partner_profile_img:
                result = {
                    "chatroom": chatroom.id,
                    "chat_partner": chat_partner.nickname,
                    "unread_count": unread_count,
                    "profile_img": partner_profile_img,
                }
            else:
                result = {
                    "chatroom": chatroom.id,
                    "chat_partner": chat_partner.nickname,
                    "unread_count": unread_count,
                }

            chatrooms_context.append(result)

        return chatrooms_context
    
class Chat_desc(APIView):    
    permission_classes = [IsTokenValid]
    
    def post(self, request):        
        try:            
            chat_room_id = request.data.get('chat_room_id')

            messages = Message.objects.filter(chatroom=chat_room_id).order_by("sent_at")
            serializer = MessageSerializer(messages, many=True)
            
            context = {
                "messages" : serializer.data
            }
                                 
            return Response(context, status=status.HTTP_200_OK)  # 이 부분 수정
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 