from django.urls import path, re_path
from .consumers import MyConsumer

websocket_urlpatterns = [
    path('alarm/<str:user_id>', MyConsumer.as_asgi()),
]