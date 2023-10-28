from django.urls import path
from .views import AlarmList


urlpatterns = [
    path('', AlarmList.as_view()), # 알람 리스트
    # path('send/', AlarmSend.as_view()), # 알람 보내기
]