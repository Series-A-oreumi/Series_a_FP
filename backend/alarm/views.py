from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from alarm.models import Alarm
from alarm.serializers import AlarmSerializer
from user.utils import get_user_from_token
from user.permissions import IsTokenValid
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# alarm list
class UnCheckAlarmList(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def get(self, request):
        try:
            user = get_user_from_token(request)
            uncheck_alarms = Alarm.objects.filter(receiver=user, is_check=False) # 현재 로그인 한 유저가 알람 받는이에 속하면서 아직 확인하지 알람들

            alarms_info = []  # 알람 리스트를 담을 공간

             # 아직 확인하지 않은 알람 데이터
            for alarm in uncheck_alarms:
                alarm.is_check = True # 확인했음을 표시
                alarm.save()
                alarm_serializer = AlarmSerializer(alarm)
                alarm_info = {
                    'check_alarm': alarm_serializer.data,  # 알람과 관련된 정보
                }
                alarms_info.append(alarm_info)

            data = {
                'alarm': alarms_info
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Alarm.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            # for alarm in alarms:
            #     alarm.is_check = True # 확인했음을 표시
            #     alarm.save()
            #     alarm_serializer = AlarmSerializer(alarm)
                
            #     if alarm.story:
            #         alarm_info = {
            #         'alarm': alarm_serializer.data, # 알람과 관련된 정보
            #         'story_id': alarm.story_id,  # 알람과 연결된 스토리 ID
            #         }   
                    
            #     else:
            #         alarm_info = {
            #         'alarm': alarm_serializer.data, # 알람과 관련된 정보
            #         'study_id': alarm.study_id,  # 알람과 연결된 스터디 ID
            #         }   

            

class CheckAlarmList(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def get(self, request):
        try:
            user = get_user_from_token(request)
            check_alarms = Alarm.objects.filter(receiver=user, is_check=True)

            alarms_info = []  # 알람 리스트를 담을 공간

            # 이미 확인한 알람 데이터
            for alarm in check_alarms:
                alarm_serializer = AlarmSerializer(alarm)
                alarm_info = {
                    'check_alarm': alarm_serializer.data,  # 알람과 관련된 정보
                }
                alarms_info.append(alarm_info)

            data = {
                'alarm': alarms_info
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Alarm.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

# WebSocket을 통해 연결된 클라이언트에 알림을 보내는 것과 관련된 기능
class AlarmSend(APIView):
    def post(self, request):
        
        instance = get_object_or_404(Alarm, pk=request.data['notify_id'])
        alarms = Alarm.objects.filter(receiver=instance.receiver,is_read=False)

        alarms_info = [] # 알람 리스트를 담을 공간
        for alarm in alarms:
            alarm_serializer = AlarmSerializer(alarm)
            
            if alarm.story:
                alarm_info = {
                'alarm': alarm_serializer.data, # 알람과 관련된 정보
                'story_id': alarm.story_id,  # 알람과 연결된 스토리 ID
                }   
                
            else:
                alarm_info = {
                'alarm': alarm_serializer.data, # 알람과 관련된 정보
                'study_id': alarm.study_id,  # 알람과 연결된 스터디 ID
                }   

            alarms_info.append(alarm_info)
            
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(f'alarm_{instance.receiver.id}', {
            'type': 'alarm',
            'message': alarms_info,
        })
        
        data = {
            'message': '알림 전송 성공'
        }
        
        return Response(data, status=status.HTTP_200_OK)
