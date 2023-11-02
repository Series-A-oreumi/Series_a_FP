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

class ChatList(APIView):    
    # permission_classes = [IsAuthenticated]
    permission_classes = [IsTokenValid]
    
    # authentication_classes = (JWTAuthentication,)
    def get(self, request):        
        try:            
            login_nickname = get_user_from_token(request)                             
            recive_user_nickname = request.GET.get('riceve_user_nickname')
            login_user_info = UserProfileSerializer(login_nickname)                        
            message = {
                "user": login_user_info.data
            }                        
            return Response(message , status=status.HTTP_200_OK)  # 이 부분 수정
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 

class Create_chatroom(APIView): 

    permission_classes = [IsTokenValid]

    def post(self, request):
        try:            
            login_nickname = get_user_from_token(request) 
            print(login_nickname)
            if request.data.get('guest'):                
                guest = request.data.get('guest')
                guest_bool = UserProfile.objects.get(nickname = guest)                   
                if guest_bool:                    
                    host = UserProfile.objects.get(nickname = login_nickname)                       
                    host_id = host.id            

                    chatroom, is_created = ChatRoom.objects.get_or_create(chat_host=host, chat_guest=guest, nickname_id=host_id)
                    
                    # 현재 로그인한 사용자가 chat_host 또는 chat_guest인 ChatRoom을 검색
                    chatrooms = ChatRoom.objects.filter(Q(chat_host=host) | Q(chat_guest=host))            

                    # 최종적으로 넘겨줄 결과 chatroom 리스트 초기화
                    chatrooms_context = []

                    # 각 chatroom에 대해 필요한 정보 가져옴
                    for chatroom in chatrooms:                                      
                        if chatroom.chat_host == str(host):                                        
                            chat_partner = UserProfile.objects.get(nickname=chatroom.chat_guest)
                        else:                    
                            chat_partner = UserProfile.objects.get(nickname=chatroom.chat_host)                        
                        unread_chatrooms = Message.objects.filter(receiver=host, is_read=False,chatroom_id=chatroom.id)
                        unread_count = unread_chatrooms.count()  
                    
                        if guest_bool.profile_img:
                            print("이미지 있음")
                            result = {
                            "chatroom": chatroom.id,  # 채팅방 정보
                            "chat_partner": chat_partner.nickname,  # 채팅 상대방의 정보    
                            "profile_img": guest_bool.profile_img,
                            "unread_count" : unread_count
                            }   
                        else:
                            print("이미지 없음")
                            result = {
                            "chatroom": chatroom.id,  # 채팅방 정보
                            "chat_partner": chat_partner.nickname,  # 채팅 상대방의 정보                                
                            "unread_count" : unread_count
                            }       
                                     
                                    
                        chatrooms_context.append(result)                 
                return Response(chatrooms_context, status=status.HTTP_200_OK)  # 이 부분 수정
            else:
                host = UserProfile.objects.get(nickname = login_nickname)                   
                host_id = host.id                                            
                
                # 현재 로그인한 사용자가 chat_host 또는 chat_guest인 ChatRoom을 검색
                chatrooms = ChatRoom.objects.filter(Q(chat_host=host) | Q(chat_guest=host))                            

                # 최종적으로 넘겨줄 결과 chatroom 리스트 초기화
                chatrooms_context = []

                # 각 chatroom에 대해 필요한 정보 가져옴
                for chatroom in chatrooms:                
                    if chatroom.chat_host == str(host):                                        
                        chat_partner = UserProfile.objects.get(nickname=chatroom.chat_guest)
                    else:                    
                        chat_partner = UserProfile.objects.get(nickname=chatroom.chat_host)
                
                    unread_chatrooms = Message.objects.filter(receiver=host, is_read=False,chatroom_id=chatroom.id)
                    unread_count = unread_chatrooms.count()  
                    result = {
                        "chatroom": chatroom.id,  # 채팅방 정보
                        "chat_partner": chat_partner.nickname,  # 채팅 상대방의 정보                                        
                        "unread_count" : unread_count
                    }                
                                
                    chatrooms_context.append(result)                  
                return Response(chatrooms_context, status=status.HTTP_200_OK)  # 이 부분 수정
            
        except Exception as e:
            return Response( str(e) , status=status.HTTP_404_NOT_FOUND) 

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