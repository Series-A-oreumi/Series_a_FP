# Generated by Django 4.2.6 on 2024-01-08 03:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stack',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('python', 'Python'), ('java', 'Java'), ('javascript', 'Javascript'), ('spring', 'Spring'), ('django', 'Django'), ('react', 'React')], max_length=12)),
            ],
        ),
        migrations.CreateModel(
            name='Study',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('content', models.CharField(blank=True, max_length=300, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('end_at', models.DateTimeField()),
                ('start_at', models.DateTimeField()),
                ('views', models.IntegerField(default=0)),
                ('project_study', models.CharField(choices=[('project', '프로젝트'), ('study', '스터디')], max_length=8)),
                ('online_offline', models.CharField(choices=[('ON', '온라인'), ('OFF', '오프라인'), ('ONOFF', '온/오프라인')], max_length=5)),
                ('field', models.CharField(choices=[('all', '전체'), ('frontend', '프론트엔드'), ('backend', '백엔드'), ('design', '디자이너'), ('devops', '데브옵스')], default='all', max_length=10)),
                ('participant_count', models.CharField(choices=[('0', '인원 미정'), ('1', '1명'), ('2', '2명'), ('3', '3명'), ('4', '4명'), ('5', '5명'), ('6', '6명'), ('7', '7명'), ('8', '8명'), ('9', '9명'), ('10', '10명이상')], default='0', max_length=10)),
                ('period', models.CharField(choices=[('0', '기간 미정'), ('1', '1개월'), ('2', '2개월'), ('3', '3개월'), ('4', '4개월'), ('5', '5개월'), ('6', '6개월 이상')], default='0', max_length=10)),
                ('public_private', models.CharField(choices=[('public', '공개'), ('private', '비공개')], default='public', max_length=10)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='study_author', to='user.userprofile')),
                ('likes', models.ManyToManyField(blank=True, related_name='study_likes', to='user.userprofile')),
                ('stacks', models.ManyToManyField(blank=True, related_name='study_stacks', to='study.stack')),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TeamMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study.team')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.userprofile')),
            ],
        ),
        migrations.AddField(
            model_name='team',
            name='applications',
            field=models.ManyToManyField(related_name='team_applications', through='study.TeamMember', to='user.userprofile'),
        ),
        migrations.AddField(
            model_name='team',
            name='leader',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='team_leader', to='user.userprofile'),
        ),
        migrations.AddField(
            model_name='team',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='teams', to='user.userprofile'),
        ),
        migrations.AddField(
            model_name='team',
            name='study',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teams', to='study.study'),
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked', models.BooleanField(default=False)),
                ('study', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes_study', to='study.study')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='study_likes_user', to='user.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments_author', to='user.userprofile')),
                ('study', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments_study', to='study.study')),
            ],
        ),
    ]
