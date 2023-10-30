from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'chatroom', 'sender', 'receiver', 'content', 'sent_at', 'is_read')