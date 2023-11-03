from channels.routing import ProtocolTypeRouter, URLRouter
import alrarm.routing

application = ProtocolTypeRouter(
    {
        "websocket": URLRouter(alrarm.routing.websocket_urlpatterns),
    }
)
