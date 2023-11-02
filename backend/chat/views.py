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
    print("접속1")

    def post(self, request):
        try:            
            login_nickname = get_user_from_token(request) 
            
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
                    print(guest_bool)
                       
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
                            print(guest_bool.profile_img)
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
                    # if chatroom.profile_img:
                    #     print("있음")
                    # else:
                    #     print("없음")                    
                    partner_profile_img = UserProfile.objects.get(nickname=chatroom.chat_guest).profile_img.url
                    print(partner_profile_img)
                    if partner_profile_img:                        
                        result = {
                            "chatroom": chatroom.id,  # 채팅방 정보
                            "chat_partner": chat_partner.nickname,  # 채팅 상대방의 정보                                        
                            "unread_count" : unread_count,  
                            "profile_img" : partner_profile_img,                      
                        }                        
                     
                                         
                    else:
                        
                        result = {
                            "chatroom": chatroom.id,  # 채팅방 정보
                            "chat_partner": chat_partner.nickname,  # 채팅 상대방의 정보                                        
                            "unread_count" : unread_count,                                  
                        }                                                 
                    chatrooms_context.append(result)                 
            return Response(chatrooms_context, status=status.HTTP_200_OK)  # 이 부분 수정
            # return Response(status=status.HTTP_200_OK)  # 이 부분 수정
            
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