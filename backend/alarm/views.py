from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from alarm.models import Alarm
from alarm.serializers import AlarmSerializer
from user.utils import get_user_from_token
from user.permissions import IsTokenValid
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class UnCheckAlarmList(APIView):
    '''uncheck alarm list'''
    permission_classes = [IsTokenValid] 
    
    def get(self, request):
        try:
            user = get_user_from_token(request)
            uncheck_alarms = Alarm.objects.filter(receiver=user, is_check=False) 

            alarms_info = []  

            for alarm in uncheck_alarms:
                alarm.is_check = True 
                alarm.save()
                alarm_serializer = AlarmSerializer(alarm)
                alarm_info = {
                    'check_alarm': alarm_serializer.data,
                }
                alarms_info.append(alarm_info)

            data = {
                'alarm': alarms_info
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Alarm.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            

class CheckAlarmList(APIView):
    '''check alarm list'''
    permission_classes = [IsTokenValid] 
    
    def get(self, request):
        try:
            user = get_user_from_token(request)
            check_alarms = Alarm.objects.filter(receiver=user, is_check=True)

            alarms_info = [] 

            for alarm in check_alarms:
                alarm_serializer = AlarmSerializer(alarm)
                alarm_info = {
                    'check_alarm': alarm_serializer.data,
                }
                alarms_info.append(alarm_info)

            data = {
                'alarm': alarms_info
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Alarm.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class AlarmSend(APIView):
    ''' WebSocket을 통해 연결된 클라이언트에 알림을 보내는 것과 관련된 기능 '''
    def post(self, request):
        
        instance = get_object_or_404(Alarm, pk=request.data['notify_id'])
        alarms = Alarm.objects.filter(receiver=instance.receiver,is_read=False)

        alarms_info = [] 
        for alarm in alarms:
            alarm_serializer = AlarmSerializer(alarm)
            
            if alarm.story:
                alarm_info = {
                'alarm': alarm_serializer.data,
                'story_id': alarm.story_id, 
                }   
                
            else:
                alarm_info = {
                'alarm': alarm_serializer.data, 
                'study_id': alarm.study_id,  
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
