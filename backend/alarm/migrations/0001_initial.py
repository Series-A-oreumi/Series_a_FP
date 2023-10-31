# Generated by Django 4.2.6 on 2023-10-31 00:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
        ('story', '0001_initial'),
        ('study', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alarm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=255)),
                ('is_check', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alarm_receiver', to='user.userprofile')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alarm_sender', to='user.userprofile')),
                ('story', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='story.post')),
                ('study', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='study.study')),
            ],
        ),
    ]
