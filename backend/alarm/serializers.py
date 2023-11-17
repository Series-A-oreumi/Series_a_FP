from rest_framework import serializers
from .models import Alarm
from study.models import Team


class AlarmSerializer(serializers.ModelSerializer):
    team = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Alarm
        fields = '__all__'

    def get_team(self, alarm):
        study = alarm.study
        if study:
            try:
                team = Team.objects.get(study=study)
                return team.id
            except Team.DoesNotExist:
                return None
        return None
    