from django.shortcuts import get_object_or_404
from study.serializers import StudySerializer
from story.serializers import PostSerializer
from story.models import Post
from study.models import Study

from user.utils import S3ImgUploader, get_user_from_token

from .models import *
from .forms import *
from .serializers import *

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from user.permissions import IsTokenValid

# login
class LoginView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get("user")  # 유저 객체 가져오기
            refresh = serializer.validated_data.get("refresh")
            access = serializer.validated_data.get("access")
            
            user_info = UserProfileSerializer(user)

            data = {
                'user': user_info.data,
                'refresh': refresh,
                'access': access,
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# register
class RegisterView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

            # return Response(serializer.data)
        else:
            return Response(serializer.errors)


# profile detail
class ProfileDetail(APIView):
    permission_classes = [IsTokenValid]

    def get(self, request, user_id):
        try:
            user = get_user_from_token(request) # 현재 로그인을 요청한 사용자

            # 로그인 한 유저와 요청한 유저가 같은 사람이면 (본인 프로필)
            if user.id == user_id:
                user_info = UserProfile.objects.get(id=user_id) # 유저 정보
                stories = Post.objects.filter(author=user).order_by('-created_at') # 유저가 썼던 스토리 글들 (공개, 나만보기, 기수공개 상관없이 전부)
                studies = Study.objects.filter(author=user, project_study='study').order_by('-created_at') # 자신이 게시했던 스터디 글 목록
                projects = Study.objects.filter(author=user, project_study='project').order_by('-created_at')# 자신이 게시했던 프로젝트 글 목록
                total_count = stories.count() + studies.count() + projects.count() # 지금까지 썼던 게시글 총 개수
                
                user_profile = UserProfileSerializer(user_info) # 유저 정보 직렬화
                user_stories = PostSerializer(stories, many=True) # 유저가 썼던 스토리 직렬화
                print(user_stories.data)
                user_studies = StudySerializer(studies, many=True) # 유저가 썼던 스터디 직렬화
                user_projects = StudySerializer(projects, many=True) # 유저가 썼던 프로젝트 직렬화

                data = {
                    "user_info" : user_profile.data,
                    "total_count" : total_count,
                    "user_stories" : user_stories.data,
                    "user_studies" : user_studies.data,
                    "user_projects" : user_projects.data,
                }
                
            else:
                user_info = UserProfile.objects.get(id=user_id) # 해당 프로필 유저 정보
                stories = Post.objects.filter(author=user).order_by('-created_at') #  공개되어있는 게시물만 보여지도록 (아직 스토리 공개/비공개/기수보기 설정 안함 추후 수정 예정!)
                studies = Study.objects.filter(author=user, project_study='study', public_private='public').order_by('-created_at') # 공개되어있는 스터디 게시물 보여지도록
                projects = Study.objects.filter(author=user, project_study='project', public_private='public').order_by('-created_at') # # 공개되어있는 프로젝트 게시물 보여지도록
                total_count = stories.count() + studies.count() + projects.count() # 지금까지 썼던 게시글 총 개수

                user_profile = UserProfileSerializer(user_info) # 유저 정보 직렬화
                user_stories = PostSerializer(stories, many=True) # 유저가 썼던 스토리 직렬화
                user_studies = StudySerializer(studies, many=True) # 유저가 썼던 스터디 직렬화
                user_projects = StudySerializer(projects, many=True) # 유저가 썼던 프로젝트 직렬화
                
                data = {
                    "user_info" : user_profile.data,
                    "total_count" : total_count,
                    "user_stories" : user_stories.data,
                    "user_studies" : user_studies.data,
                    "user_projects" : user_projects.data,
                }

            return Response(data, status=status.HTTP_200_OK)
        
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        
# profile edit & delete
class ProfileUpdateDelete(APIView):
    
    permission_classes = [IsTokenValid]

    # edit
    def put(self, request):
        user = get_user_from_token(request) # 토큰 decode 통해 로그인 한 유저 담아주기
        user_profile = get_object_or_404(UserProfile, id = user.id)

        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():

            # profile img 가 데이터에 포함되어있다면
            if 'profile_img' in request.FILES:
                image = request.FILES['profile_img']
                img_uploader = S3ImgUploader(image)  # S3ImgUploader 인스턴스 생성
                uploaded_url = img_uploader.upload()  # 이미지 업로드 및 URL 가져오기
                user_profile.profile_img = uploaded_url # 프로필 이미지 URL 업데이트
            serializer.save()

            messages = {
                'success' : '프로필이 성공적으로 수정되었습니다.'
            }
            return Response(messages, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        user = get_user_from_token(request) # 토큰 decode 통해 로그인 한 유저 담아주기
        profile = get_object_or_404(UserProfile, user=user)

        profile.delete()
        messages = {
            'success' : '회원을 탈퇴하였습니다.'
            }
        return Response(messages, status=status.HTTP_200_OK)


