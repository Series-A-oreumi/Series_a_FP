from django.db import models
from user.models import UserProfile

# Create your models here.
class ChatRoom(models.Model):
    id = models.AutoField(primary_key=True)
    nickname = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=True)    
    chat_host = models.CharField(max_length=255)
    chat_guest = models.CharField(max_length=255)


class Message(models.Model):
    id = models.AutoField(primary_key=True)
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True)
    sender = models.CharField(max_length=255)
    receiver = models.CharField(max_length=255)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)