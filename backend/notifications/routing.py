from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/study/<int:study_id>/', consumers.NotificationsConsumer.as_asgi()),
    path('ws/story/<int:story_id>/', consumers.NotificationsConsumer.as_asgi()),
    # 여러 개의 웹소켓 경로 및 컨슈머를 추가할 수 있습니다.
]

application = ProtocolTypeRouter({
    'websocket': URLRouter(websocket_urlpatterns),
})