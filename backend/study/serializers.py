from rest_framework import serializers
from .models import Study, Comment, Stack
from story.serializers import PostAuthorSerializer

class StackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = ['name',]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class StudySerializer(serializers.ModelSerializer):
    author = PostAuthorSerializer(read_only=True) # 스터디 게시한 사람
    likes_users = serializers.SerializerMethodField(read_only=True) # 좋아요를 누른 유저 목록을 가져올 필드를 추가합니다.
    stacks = StackSerializer(many=True, read_only=True) # 해당 스터디 기술 스택
    participant_users = serializers.SerializerMethodField(read_only=True) # 스터디 및 프로젝트 참여자 목록
    comments = serializers.SerializerMethodField(read_only=True) # 해당 스터디에 달린 댓글들

    class Meta:
        model = Study
        exclude = ('participants',)

    def get_likes_users(self, study):
        # study 현재 직렬화되는 Study 인스턴스

        likes_users = study.likes.all()
        # 좋아요를 누른 유저들의 정보를 시리얼라이즈하여 반환.
        return [user.username for user in likes_users]
    
    def get_participant_users(self, study):
        # study 현재 직렬화되는 Study 인스턴스

        participant_users = study.participants.all()
        # 참여자 유저들의 정보를 시리얼라이즈하여 반환.
        return [user.username for user in participant_users]
    
    def get_comments(self, study):
        comments = study.comments_study.all()
        return comments
    