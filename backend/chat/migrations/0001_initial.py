# Generated by Django 4.2.6 on 2023-12-07 12:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatRoom',
            name='ChatRoom',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('chat_host', models.CharField(max_length=255)),
                ('chat_guest', models.CharField(max_length=255)),
                ('nickname', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.userprofile')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('chat_host', models.CharField(max_length=255)),
                ('chat_guest', models.CharField(max_length=255)),
                ('nickname', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            name='Message',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('sender', models.CharField(max_length=255)),
                ('receiver', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('chatroom', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('sender', models.CharField(max_length=255)),
                ('receiver', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('chatroom', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom')),
            ],
        ),
    ]
