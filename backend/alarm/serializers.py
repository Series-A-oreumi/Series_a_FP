from rest_framework import serializers
from .models import Alarm
from study.models import Team


class AlarmSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Alarm
        fields = '__all__'
    
    def get_sender(self, alarm):
        sender = alarm.sender.nickname
        return sender
    