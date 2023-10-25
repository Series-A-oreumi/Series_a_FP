from django.db import models
from user.models import UserProfile
from django.db.models.signals import post_save

class Post(models.Model):
    # 게시글 모델
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='post_author') # 작성자
    title = models.CharField(max_length=200, null=True, blank=True) # 제목
    content = models.CharField(max_length=200, null=True, blank=True) # 내용

    views = models.IntegerField(default=0) # 조회수
    created_at = models.DateTimeField(auto_now_add=True) # 생성날짜
    updated_at = models.DateTimeField(auto_now=True) # 수정날짜
    likes = models.ManyToManyField(UserProfile, related_name='post_likes', blank=True) # 좋아요
    hashtags = models.ManyToManyField('story.Hashtag', blank=True, related_name='post_hashtags')

    def __str__(self):
        return self.title
		
    # 해당 게시글에 달린 댓글들
    def comments(self):
        ''' Get all comments '''
        return self.comment_post
    
    # 해당 게시글에 달린 댓글들 수
    def comments_count(self):
        ''' Get all comments '''
        return self.comment_post.count()
		
	  # 게시글 좋아요 수
    def likes_count(self):
        '''좋아요 수 카운트 '''
        if self.likes.count():
            return self.likes.count()
        return 0


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    images = models.FileField()
    
    def __str__(self):
        return self.images.url

class Comment(models.Model):
    # 댓글 모델
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comment_post') 
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='comment_author')
    content = models.CharField(max_length=1000)

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
		
		
class Like(models.Model):
    # 좋아요 모델
    post = models.ForeignKey(Post,on_delete=models.CASCADE, related_name='like_post')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='like_user')
    liked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} likes {self.post}"

class Hashtag(models.Model):
    # 해시태그 모델
    name = models.CharField(max_length=500, blank=False, unique=True)
    
    def related_posts(self):
        return Post.objects.filter(hashtags__id=self.pk)
    
    def __str__(self):
        return self.name