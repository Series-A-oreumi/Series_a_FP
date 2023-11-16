from django.contrib.auth.views import LoginView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from user.utils import get_user_from_token, S3ImgUploader
from rest_framework import status
from user.serializers import UserProfileSerializer
from user.permissions import IsTokenValid  # 커스텀 권한 클래스 임포트
from rest_framework.decorators import api_view
from .models import *
import json
from user.models import UserProfile
from django.db.models import Q
from datetime import datetime
from .serializers import MessageSerializer
import openai

openai.api_key = "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"

class Chat_AI(APIView):    
    # permission_classes = [IsAuthenticated]
    permission_classes = [IsTokenValid]
    
    # authentication_classes = (JWTAuthentication,)
    def post(self, request):        
        # prompt = request.POST.get("title")        
        try:  
            prompt = request.data.get('title')
                               
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
            )
            # 반환된 응답에서 텍스트 추출해 변수에 저장
            
            message = response["choices"][0]["message"]["content"]
            print(message)
                     
            message = {
                "message": message
            }                        
            return Response(message, status=status.HTTP_200_OK)  # 이 부분 수정
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 
class ChatList(APIView):    
    permission_classes = [IsTokenValid]
    
    def get(self, request):        
        try:            
            login_nickname = get_user_from_token(request)                             
            # recive_user_nickname = request.GET.get('riceve_user_nickname')
            login_user_info = UserProfileSerializer(login_nickname)                        
            message = {
                "user": login_user_info.data
            }                        
            return Response(message , status=status.HTTP_200_OK)  # 이 부분 수정
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

                if guest_user != request_user:  # 자기 자신과의 채팅 방지
                    host = UserProfile.objects.get(nickname=request_user.nickname)
                    host_id = host.id

                    # 이미 존재하는 채팅방 확인
                    chatroom = ChatRoom.objects.filter(
                        Q(chat_host=host.nickname, chat_guest=guest_user.nickname) | Q(chat_host=guest_user.nickname, chat_guest=host.nickname)
                    ).first()
                    
                    if chatroom is None:
                        # 채팅방이 없으면 생성
                        chatroom = ChatRoom.objects.create(
                            chat_host=host.nickname, chat_guest=guest_user.nickname, nickname_id=host_id
                        )
                    

                    # 채팅방 정보 가져오는 코드
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
    # permission_classes = [IsAuthenticated]
    permission_classes = [IsTokenValid]
    
    # authentication_classes = (JWTAuthentication,)
    def post(self, request):        
        try:            
            # login_nickname = get_user_from_token(request)                             
            # guest = request.data.get('guest')
            chat_room_id = request.data.get('chat_room_id')
            # host = UserProfile.objects.get(nickname = login_nickname)   
            # host_id = host.id 
            messages = Message.objects.filter(chatroom=chat_room_id).order_by("sent_at")
            serializer = MessageSerializer(messages, many=True)
            

            context = {
                "messages" : serializer.data
            }
            
                                  
            return Response(context, status=status.HTTP_200_OK)  # 이 부분 수정
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 