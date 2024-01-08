from django.urls import path
from .views import UnCheckAlarmList, CheckAlarmList, AlarmSend


urlpatterns = [
    path('uncheck/', UnCheckAlarmList.as_view()), 
    path('check/', CheckAlarmList.as_view()),
    path('send/', AlarmSend.as_view()),
]