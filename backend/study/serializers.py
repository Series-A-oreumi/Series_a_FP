from rest_framework import serializers
from .models import Like, Study, Comment, Stack
from user.serializers import UserProfileSerializer

class StackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = ['name',]


class CommentSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True) # 댓글 작성자 추가
    class Meta:
        model = Comment
        fields = '__all__'

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']

class StudySerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True) # 스터디 게시한 사람
    stacks = StackSerializer(many=True, read_only=True) # 해당 스터디 기술 스택
    likes_users = serializers.SerializerMethodField() # 좋아요를 누른 유저 목록

    class Meta:
        model = Study
        fields = ['pk', 'author', 'title', 'content', 'period', 'created_at','participant_count', 'end_at', 'views', 'comments_count', 'project_study', 
                  'likes_count', 'likes', 'likes_users', 'online_offline', 'field', 'stacks', 'public_private']

    def get_likes_users(self, post):
        likes_users = post.likes.all()
        return [user.username for user in likes_users] # 좋아요를 누른 유저들의 정보를 시리얼라이즈하여 반환.


class StudyDetailSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True) # 스터디 게시할 사람
    likes_users = serializers.SerializerMethodField(read_only=True) # 좋아요를 누른 유저 목록을 가져올 필드를 추가합니다.
    stacks = StackSerializer(many=True, read_only=True) # 해당 스터디 기술 스택
    participant_users = serializers.SerializerMethodField(read_only=True) # 스터디 및 프로젝트 참여자 목록 (리스트)
    comments_count = serializers.SerializerMethodField(read_only=True) # 해당 스터디에 달린 댓글수
    comments_list = serializers.SerializerMethodField(read_only=True) # 해당 스터디에 달린 댓글 리스트
    likes_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Study
        fields = ('pk', 'author', 'title', 'content', 'end_at', 'views', 'comments_count', 'project_study', 
                  'likes_count','participant_count', 'likes', 'likes_users', 'online_offline', 'field', 'stacks', 'public_private')

    
    def get_likes_count(self, study):
        '''좋아요 수 카운트 '''
        if study.likes.count():
            return study.likes.count()
        return 0
    
    def get_likes_users(self, study):
        likes_users = study.likes.all()
        return [user.username for user in likes_users]
    
    def get_participant_users(self, study):

        participant_users = study.participants.all()
        return [user.username for user in participant_users]
    
    def get_comments_count(self, study):
        comment_count = study.comments_study.all().count()
        return comment_count
    
    def get_comments_list(self, study):
        comments = study.comments_study.all() 
        serialized_comments = CommentSerializer(comments, many=True).data 
        return serialized_comments
    
    class Meta:
        model = Study
        fields = '__all__'


class StudyCreateSerializer(serializers.ModelSerializer):
    
    stacks = serializers.ListField(child=serializers.CharField(max_length=12), write_only=True, required=False)

    class Meta:
        model = Study
        fields = '__all__' 

    # stacks를 name으로 입력받고 pk값으로 변환해서 저장
    def to_internal_value(self, data):
        stack_names = data.get('stacks', [])

        stack_pks = []
        for stack_name in stack_names:
            try:
                stack, created = Stack.objects.get_or_create(name=stack_name)
                stack_pks.append(stack.pk)
            except Stack.DoesNotExist:
                # 스택이 존재하지 않을 경우 처리
                pass

        # 변환된 스택의 기본 키 값을 'stacks' 필드에 설정
        data['stacks'] = stack_pks
        return super().to_internal_value(data)
    

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'