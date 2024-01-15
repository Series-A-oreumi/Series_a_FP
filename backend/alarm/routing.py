from django.urls import path
from .consumers import MyConsumer

websocket_urlpatterns = [
    path('alarm/<str:token>', MyConsumer.as_asgi()),
]