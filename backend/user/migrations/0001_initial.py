# Generated by Django 4.2.6 on 2023-12-07 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('username', models.CharField(max_length=50)),
                ('password', models.CharField(max_length=255)),
                ('nickname', models.CharField(max_length=255)),
                ('bootcamp', models.CharField(max_length=255)),
                ('profile_img', models.FileField(blank=True, null=True, upload_to='')),
                ('info', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
            ],
        ),
    ]
