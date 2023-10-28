from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from alarm.models import Alarm
from alarm.serializers import AlarmSerializer
from user.utils import get_user_from_token
from user.permissions import IsTokenValid


# alarm list
class AlarmList(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def get(self, request):
        try:
            user = get_user_from_token(request)
            alarms = Alarm.objects.filter(receiver=user, is_check=False) # 현재 로그인 한 유저가 알람 받는이에 속하면서 아직 확인하지 알람들

            alarms_info = [] # 알람 리스트를 담을 공간
            for alarm in alarms:
                alarm.is_check = True # 확인했음을 표시
                alarm.save()
                alarm_serializer = AlarmSerializer(alarm)
                
                if alarm.story:
                    alarm_info = {
                    'notify': alarm_serializer.data, # 알람과 관련된 정보
                    'story_id': alarm.story_id,  # 알람과 연결된 스토리 ID
                    }   
                    
                else:
                    alarm_info = {
                    'notify': alarm_serializer.data, # 알람과 관련된 정보
                    'study_id': alarm.study_id,  # 알람과 연결된 스터디 ID
                    }   

                alarms_info.append(alarm_info)

            data = {
                'alarms': alarms_info
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Alarm.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
