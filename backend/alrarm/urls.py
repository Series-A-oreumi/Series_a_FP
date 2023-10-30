from django.urls import path
from . import views

urlpatterns = [
    # 다른 URL 패턴들...
    path('api/notifications/', views.NotificationCreateAPIView.as_view(), name='notification-create'),
]