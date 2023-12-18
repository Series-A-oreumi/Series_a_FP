from django.db import models
from user.models import UserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

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
        
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
            'your_group_name',  
        {
            'type': 'chat.message',  
            'sender' : message.sender,
            'receiver' : message.receiver,
            'message': message.is_read,  
            'chatroom_id' : message.chatroom_id
        }
    )
