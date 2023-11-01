from django.db import models
from user.models import UserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

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

@receiver(post_save, sender=Message)
def your_model_post_save(sender, instance, created, **kwargs):
    your_data = instance
    if created:
        message = your_data    
    # 채널 레이어를 통해 메시지를 전송
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'your_group_name',  # 메시지를 보낼 그룹 이름
        {
            'type': 'chat.message',  # Consumer의 메서드 이름
            'receiver' : your_data.receiver,
            'message': message.is_read,  # 전송할 메시지
            'chatroom_id' : message.chatroom_id
        }
    )
