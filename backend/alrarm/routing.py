from django.urls import path, re_path
from . import consumers

websocket_urlpatterns = [
    # path(r"ws/notifications/1/", consumers.NotificationConsumer.as_asgi()),
    re_path(r"ws/notifications/(?P<user>\d+)/$", consumers.NotificationConsumer.as_asgi()),
]
# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.urls import re_path
# from alrarm import consumers

# application = ProtocolTypeRouter(
#     {
#         "websocket": URLRouter(
#             [
#                 re_path(r"ws/notifications/", consumers.NotificationConsumer.as_asgi()),
#             ]
#         ),
#     }
# )
