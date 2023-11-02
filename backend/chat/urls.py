from django.contrib import admin
from django.urls import path,include
from django.contrib.auth import views as auth_views
from . import views


app_name = 'chat'
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]


urlpatterns = [        
    path('api', views.ChatList.as_view(), name='chat'),
    path('create_chatroom', views.Create_chatroom.as_view(), name='chat2'),
    path('chat_desc', views.Chat_desc.as_view(), name='chat3'),
    path('ai', views.Chat_AI.as_view(), name='ai'),
    # path('api/send_message', views.send_message, name='cmessage'),
]