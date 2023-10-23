from rest_framework import serializers
from .models import Hashtag, Like, Post, Comment, PostImage
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

# 게시글 작성유저
class PostAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username']

# 스토리 이미지
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['images']

# 게시글 목록
class PostSerializer(serializers.ModelSerializer):
    author = PostAuthorSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    # likes = PostAuthorSerializer(many=True)
    hashtags = HashtagSerializer(many=True, read_only=True)  # HashtagSerializer를 사용하여 해시태그 이름을 가져옵니다.
    # comments = CommentSerializer(many=True)  # 댓글 정보를 직렬화
    likes_users = serializers.SerializerMethodField() # 좋아요를 누른 유저 목록을 가져올 필드를 추가합니다.
    
    class Meta:
        model = Post
        fields = ['pk', 'title', 'content', 'author', 'images', 'views', 'comments_count',
                  'likes_count', 'likes_users', 'created_at', 'updated_at', 'hashtags']


    def get_likes_users(self, post):
        # post는 현재 직렬화되는 Post 인스턴스

        likes_users = post.likes.all()
        # 좋아요를 누른 유저들의 정보를 시리얼라이즈하여 반환.
        return [user.username for user in likes_users]

# 게시글 상세 목록
class PostDetailSerializer(serializers.ModelSerializer):
    author = PostAuthorSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    # likes = PostAuthorSerializer(many=True)
    hashtags = HashtagSerializer(many=True, read_only=True)  # HashtagSerializer를 사용하여 해시태그 이름을 가져옵니다.
    comments = CommentSerializer(many=True)
    likes_users = serializers.SerializerMethodField() # 좋아요를 누른 유저 목록을 가져올 필드를 추가합니다.
    class Meta:
        model = Post
        fields = ['pk', 'title', 'content', 'author', 'images', 'views', 'comments_count', "comments",
                  'likes_count', 'likes_users', 'created_at', 'updated_at', 'hashtags']
        
    def get_likes_users(self, post):
        # post는 현재 직렬화되는 Post 인스턴스

        likes_users = post.likes.all()
        # 좋아요를 누른 유저들의 정보를 시리얼라이즈하여 반환.
        return [user.username for user in likes_users]
    
# 게시글 작성
class CreatePostSerializer(serializers.ModelSerializer):
    author = PostAuthorSerializer(read_only=True)
    images = PostImageSerializer(required=False) # 일단 하나의 이미지만 보낼 수 있도록 설정 -> 추후 여러개 이미지를 보낼 수 있도록 수정 예정
    class Meta:
        model = Post
        fields = ['author', 'images', 'title', 'content']

    def create(self, validated_data):
        images_data = self.context['request'].FILES.get('images')  # 마찬가지로 getlist로 수정예정.
        post = Post.objects.create(**validated_data)

        if image_data:
            for image_data in images_data:
                PostImage.objects.create(post=post, image=image_data)

        return post
    
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'



