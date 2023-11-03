from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationCreateAPIView.as_view(), name='notification-create'),
]

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<room_name>\w+)/$', consumers.NotificationConsumer.as_asgi()),
]