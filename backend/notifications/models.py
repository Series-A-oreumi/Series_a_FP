from django.db import models
from user.models import UserProfile

# Create your models here.
class Notifications(models.Model):
    '''
    user = user의 id값 받아오기
    category_article = 기사의 종류 ( 스터디, 스토리 )
    '''
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False)
    category_article = models.CharField(max_length=255)
    article_num = models.IntegerField()
    category_likecomment = models.CharField(max_length=255)
    content = models.CharField(max_length= 300)
    created_at = models.DateTimeField(auto_now_add=True)

class Noti_Comment(models.Model):
    content = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

class Noti_Study(models.Model):
    # Study 모델 필드들
    comments = models.ManyToManyField('study.Comment', related_name='study_comments')

class Noti_Story(models.Model):
    # Story 모델 필드들
    comments = models.ManyToManyField('story.Comment', related_name='story_comments')