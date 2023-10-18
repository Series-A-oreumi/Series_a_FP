from rest_framework import serializers
from .models import Hashtag, Post, Comment
from django.contrib.auth.models import User

# 해시 태그
class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['name']

# 댓글 작성
class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']


# 댓글 목록
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

# 게시글 작성
class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['author', 'images', 'title', 'content']

# 게시글 작성유저
class PostAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username']

# 게시글 목록
class PostSerializer(serializers.ModelSerializer):
    author = PostAuthorSerializer()
    likes = PostAuthorSerializer(many=True)
    hashtags = HashtagSerializer(many=True, read_only=True)  # HashtagSerializer를 사용하여 해시태그 이름을 가져옵니다.
    comments = CommentSerializer(many=True)  # 댓글 정보를 직렬화

    class Meta:
        model = Post
        fields = ['pk', 'author', 'title', 'content', 'images', 'views', 'comments',
                  'likes', 'likes_count', 'created_at', 'updated_at', 'hashtags']
        



