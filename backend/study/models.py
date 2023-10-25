from django.db import models
from user.models import UserProfile    

# 기술 스택 model
class Stack(models.Model):
    STACK_CHOICES = [
        ('python', 'Python'),
        ('java', 'Java'),
        ('javascript', 'Javascript'),
        ('spring', 'Spring'),
        ('django', 'Django'),
        ('react', 'React'),
    ]

    # study = models.ForeignKey('study.Study', on_delete=models.CASCADE, related_name='stack_study')  # 스터디와의 관계 설정
    name = models.CharField(max_length=12, choices=STACK_CHOICES) # 스택 이름

    def __str__(self):
        return self.name
    
class Study(models.Model):

    PROJECT_STUDY_CHOICES = [
        ('project', '프로젝트'), 
        ('study', '스터디'),
    ]

    ON_OFF_CHOICES = [
        ('ON', '온라인'), 
        ('OFF', '오프라인'),
        ('ONOFF', '온/오프라인'),
     ]
    
    FIELD_CHOICES = [
        ('all', '전체'),
        ('frontend', '프론트엔드'),
        ('backend', '백엔드'),
        ('design', '디자이너'),
        ('devops', '데브옵스'),
    ]

    PARTICIPANTS_CHOICES = [
        ('undefined','인원 미정'),
        ('2', '2명'),
        ('3', '3명'),
        ('4', '4명'),
        ('5', '5명'),
        ('6', '6명'),
        ('7', '7명'),
        ('8', '8명'),
        ('9', '9명'),
        ('10', '10명이상'),
    ]
    

    PERIOD_CHOICES = [
        ('0', '기간 미정'),
        ('1', '1개월'),
        ('2', '2개월'),
        ('3', '3개월'),
        ('4', '4개월'),
        ('5', '5개월'),
        ('6', '6개월 이상'),
    ] 
    
    PUBLIC_PRIVATE_CHOICES = [
        ('public', '공개'),
        ('private', '비공개'),
    ]

    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='study_author') # 모집 공고 올린 사람
    title = models.CharField(max_length=100, null=True, blank=True) # 제목
    content = models.CharField(max_length=300, null=True, blank=True) # 내용
    created_at = models.DateTimeField(auto_now_add=True) # 모집 공고 올린 날짜
    end_at = models.DateTimeField() # 모집 마감 날짜

    start_at = models.DateTimeField() # 프로젝트 or 스터디 시작 기간
    
    participants = models.ManyToManyField(UserProfile, blank=True, related_name='study_participants') # 참여자
    views = models.IntegerField(default=0) # 조회수
    likes = models.ManyToManyField(UserProfile, related_name='study_likes', blank=True) # 좋아요


    # choice 필드
    project_study = models.CharField(max_length=8, choices=PROJECT_STUDY_CHOICES) # 프로젝트 or 스터디 선택
    online_offline = models.CharField(max_length=5, choices=ON_OFF_CHOICES) # 온라인 or 오프라인
    field = models.CharField(max_length=10, choices=FIELD_CHOICES, default=FIELD_CHOICES[0][0]) # 직무 선택
    stacks = models.ManyToManyField(Stack, blank=True, related_name="study_stacks") # 기술 스택 선택
    participant_count = models.CharField(max_length=10, choices=PARTICIPANTS_CHOICES, default=PARTICIPANTS_CHOICES[0][0]) # 모집 정원
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES, default=PERIOD_CHOICES[0][0]) # 예상 진행 기간
    public_private = models.CharField(max_length=10, choices=PUBLIC_PRIVATE_CHOICES, default=PUBLIC_PRIVATE_CHOICES[0][0]) # 공개 비공개 여부

    def __str__(self):
        return self.title
    
     # 게시글 좋아요 수
    def likes_count(self):
        '''좋아요 수 카운트 '''
        if self.likes.count():
            return self.likes.count()
        return 0

class Comment(models.Model):
    study = models.ForeignKey(Study, on_delete=models.CASCADE, related_name='comments_study')
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='comments_author')
    content = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.study