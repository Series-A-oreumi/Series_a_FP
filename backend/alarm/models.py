from django.db import models
from user.models import UserProfile

class Alarm(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='alarm_sender') # 보내는이
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='alarm_receiver') # 받는이
    content = models.CharField(max_length=255) # 알람 내용
    is_check = models.BooleanField(default=False) # 확인했는지 여부
    created_at = models.DateTimeField(auto_now_add=True) # 알람이 생성된 시간
    story = models.ForeignKey('story.Post', on_delete=models.CASCADE, blank=True, null=True) # 스토리
    study = models.ForeignKey('study.Study', on_delete=models.CASCADE, blank=True, null=True) # 스터디 
    team = models.ForeignKey('study.Team', on_delete=models.CASCADE, blank=True, null=True) # 팀
    
    def __str__(self):
        return f'{self.receiver}회원에게 온 알람'