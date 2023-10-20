from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

class Post(models.Model):
    # 게시글 모델
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_author') # 작성자
    title = models.CharField(max_length=200, null=True, blank=True) # 제목
    content = models.CharField(max_length=200, null=True, blank=True) # 내용

    # 이미지는 추후에 s3 저장소로 저장위치 변경 할 예정.
    images = models.ImageField('Image', upload_to='post/', blank=True) # 이미지
    views = models.IntegerField(default=0) # 조회수
    created_at = models.DateTimeField(auto_now_add=True) # 생성날짜
    updated_at = models.DateTimeField(auto_now=True) # 수정날짜
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True) # 좋아요
    hashtags = models.ManyToManyField('story.Hashtag', blank=True, related_name='post_hashtags')

    def __str__(self):
            return self.title
		
    # 해당 게시글에 달린 댓글들
    def comments(self):
        ''' Get all comments '''
        return Comment.objects.filter(post__id=self.id)
		
	  # 게시글 좋아요 수
    def likes_count(self):
        '''좋아요 수 카운트 '''
        if self.likes.count():
            return self.likes.count()
        return 0


class Comment(models.Model):
    # 댓글 모델
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comment_post') 
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_author')
    content = models.CharField(max_length=1000)
    likes = models.ManyToManyField(User, blank=True, related_name="comment_like")
    # 대댓글을 위한 필드
    parent_comment = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='comment_parent')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
    
    # 댓글 좋아요 수
    def likes_count(self):
        if self.likes.count():
            return self.likes.count()
        return 0
		
# 댓글 작성 시 댓글알람
# def comment_action(sender, **kwargs):
#     if kwargs['created']:
#         comment = kwargs['instance']
#         post = comment.post
#         content = f'{post.title}에 댓글을 남겼습니다.'

#         # noti = Notification.objects.create(sender=comment.writer,receiver=post.writer,content=content)
#         if comment.parent_comment is None:
#             noti = Notification.objects.create(
#                 sender=comment.writer, receiver=post.writer, content=content)
#         else:
#             parent_comment = comment.parent_comment
#             noti_content = f'{parent_comment.content}에 대댓글을 달았습니다.'
#             noti = Notification.objects.create(
#                 sender=comment.writer, receiver=parent_comment.writer, content=noti_content)


# post_save.connect(comment_action, sender=Comment)
		

class Hashtag(models.Model):
    # 해시태그 모델
    name = models.CharField(max_length=500, blank=False, unique=True)
    
    def related_posts(self):
        return Post.objects.filter(hashtags__id=self.pk)
    
    def __str__(self):
        return self.name