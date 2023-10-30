from django.urls import path, re_path
from .consumers import MyConsumer

websocket_urlpatterns = [
    # re_path(r'ws/alarm/(?P<token>[\w\d]+)/$', MyConsumer.as_asgi()),  # WebSocket 경로 정의
    path('alarm/<str:token>', MyConsumer.as_asgi()),
]