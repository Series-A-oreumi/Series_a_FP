from django.urls import path
from .views import UnCheckAlarmList, CheckAlarmList, AlarmSend


urlpatterns = [
    path('uncheck/', UnCheckAlarmList.as_view()), # 체크되지 않은 알람 리스트
    path('check/', CheckAlarmList.as_view()), # 체크 완료 알람 리스트
    path('send/', AlarmSend.as_view()), # 알람 보내기
]