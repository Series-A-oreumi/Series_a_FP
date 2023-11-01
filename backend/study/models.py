from django.db import models
from alarm.models import Alarm
from user.models import UserProfile   
from django.dispatch import receiver 
from django.db.models.signals import post_save

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

    # 로그인 한 유저가 해당 스터디 작성자와 다른 사람이면 신청하기 버튼을 보여주기 (프론트 작업) -> 추후 추가 기능
    # 신청하기 버튼을 클릭 시 해당 게시물 작성자에게 알람으로 ~유저로부터 ~스터디 신청하기가 왔다 (수락) 버튼 만들기 -> 추후 추가 기능
    # 수락 버튼 클릭 시 해당 스터디 참가인원 + 1 해주고 해당 유저를 스터디 참여자로 추가하기 -> view
    # 비수락시 해당 스터디 참가인원 변동x, 해당 유저 스터디 참여자로 x -> view
    
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
        ('0','인원 미정'),
        ('1', '1명'),
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
    
     # 해당 게시글에 달린 댓글들 수
    def comments_count(self):
        ''' Get all comments '''
        return self.comments_study.count()

class Comment(models.Model):
    study = models.ForeignKey(Study, on_delete=models.CASCADE, related_name='comments_study')
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='comments_author')
    content = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.study.title
    
# Comment 모델에 데이터가 저장될 때 실행되도록 설정 (Comment 알람기능)
@receiver(post_save, sender=Comment) 
def comment_action(sender, instance, created, **kwargs):
    if created:  # 새로운 댓글이 생성된 경우
        comment = instance # Comment 모델의 인스턴스
        study = comment.study  # 현재 댓글이 달린 스토리
        sender_user = comment.author # 댓글은 단 유저
        receiver_user = study.author # 해당 게시물 작성자

        content = f'{sender_user.nickname}님이 회원님의 {study.title}에 댓글을 남겼습니다.'
        
        alarm = Alarm.objects.create(sender=sender_user, receiver=receiver_user, content=content)

        alarm.study = study  # 스토리와 연결
        alarm.save()

class Like(models.Model):
    # 좋아요 모델
    study = models.ForeignKey(Study,on_delete=models.CASCADE, related_name='likes_study')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='study_likes_user')
    liked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} likes {self.study}"

# Like 모델에 데이터가 생성될 때 실행되도록 설정 (Like 알람기능)
@receiver(post_save, sender=Like) 
def like_action(sender, instance, created, **kwargs):
    if created:  # 좋아요가 생성된 경우
        like = instance # Like 모델의 인스턴스
        study = like.study # 현재 좋아요가 달린 스터디
        sender_user = like.user # 댓글은 단 유저
        receiver_user = study.author # 해당 게시물 작성자

        content = f'{sender_user.nickname}님이 회원님의 {study.title}에 좋아요를 눌렀습니다.'
        
        alarm = Alarm.objects.create(sender=sender_user, receiver=receiver_user, content=content)

        alarm.study = study  # 스터디와 연결
        alarm.save()