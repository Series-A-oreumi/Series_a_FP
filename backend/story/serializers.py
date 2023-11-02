from rest_framework import serializers
from .models import Hashtag, Like, Post, Comment, PostImage
from user.models import UserProfile
from user.serializers import UserProfileSerializer


# 해시 태그
class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ["name"]


# 댓글 작성
class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["content"]


# 댓글 목록
class CommentSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True) # 댓글 작성자 추가
    class Meta:
        model = Comment
        fields = "__all__"


# 스토리 이미지
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["images"]


# 게시글 목록
class PostSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    images = serializers.SerializerMethodField()
    hashtags = HashtagSerializer(many=True, read_only=True)  # HashtagSerializer를 사용하여 해시태그 이름을 가져옴
    likes_users = serializers.SerializerMethodField()  # 좋아요를 누른 유저 목록을 가져올 필드를 추가합니다.
    # likes = PostAuthorSerializer(many=True)
    comments = CommentSerializer(many=True)  # 댓글 정보를 직렬화

    class Meta:
        model = Post
        fields = [
            "pk",
            "title",
            "content",
            "author",
            "images",
            "views",
            "comments_count",
            "comments",
            "likes_count",
            "likes_users",
            "created_at",
            "updated_at",
            "hashtags",
        ]

    # 메소드 만들기
    def get_likes_users(self, post):
        # post는 현재 직렬화되는 Post 인스턴스
        likes_users = post.likes.all()
        return [user.id for user in likes_users]  # 좋아요를 누른 유저들의 정보를 시리얼라이즈하여 반환.

    def get_images(self, post):
        images = post.images.all()
        return PostImageSerializer(instance=images, many=True, context=self.context).data

    # 이미지 저장
    def create(self, validated_data):
        images_data = self.context["request"].FILES.getlist("images")
        instance = Post.objects.create(**validated_data)

        for image_data in images_data:
            PostImage.objects.create(post=instance, image=image_data)

        return instance

    def get_comments(self, post):
        comments = post.comment_post.all()
        return CommentSerializer(comments, many=True).data


# 게시글 상세 목록
class PostDetailSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    images = serializers.SerializerMethodField()
    hashtags = HashtagSerializer(
        many=True, read_only=True
    )  # HashtagSerializer를 사용하여 해시태그 이름을 가져옵니다.
    comments = serializers.SerializerMethodField()
    likes_users = serializers.SerializerMethodField()  # 좋아요를 누른 유저 목록을 가져올 필드를 추가합니다.

    # likes = PostAuthorSerializer(many=True)
    class Meta:
        model = Post
        fields = [
            "pk",
            "title",
            "content",
            "author",
            "images",
            "views",
            "comments_count",
            "comments",
            "likes_count",
            "likes_users",
            "created_at",
            "updated_at",
            "hashtags",
        ]

    def get_likes_users(self, post):
        # post는 현재 직렬화되는 Post 인스턴스
        likes_users = post.likes.all()
        return [user.username for user in likes_users]  # 좋아요를 누른 유저들의 정보를 시리얼라이즈하여 반환.

    def get_images(self, post):
        images = post.images.all()
        return PostImageSerializer(instance=images, many=True, context=self.context).data

    def get_comments(self, post):
        comments = post.comment_post.all()
        return CommentSerializer(comments, many=True).data


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
