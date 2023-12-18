from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.NotificationCreate.as_view(), name='NotificationCreate'),
]

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user>\w+)/$', consumers.NotificationsConsumer.as_asgi()),
    re_path(r'ws/users/$', consumers.NotificationsConsumer.as_asgi()),
]