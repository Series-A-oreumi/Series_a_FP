from django.shortcuts import get_object_or_404
from alarm.models import Alarm
from study.serializers import StudySerializer
from story.serializers import PostSerializer
from story.models import Post
from study.models import Study

from user.utils import S3ImgUploader, get_user_from_token

from .models import *
from .forms import *
from .serializers import *

from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from user.permissions import IsAdminValid, IsTokenValid

class LoginView(GenericAPIView):
    '''로그인'''
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get("user")  # 유저 객체 가져오기
            refresh = serializer.validated_data.get("refresh")
            access = serializer.validated_data.get("access")
            
            user_info = UserProfileSerializer(user)
            
            check_alarm = Alarm.objects.filter(receiver=user, is_check=True).values() # 로그인 요청을 한 유저의 이전 알람 기록들
            uncheck_alarm = Alarm.objects.filter(receiver=user, is_check=False).values() # 로그인 요청을 한 유저의 확인안한 알람 기록들
            
            data = {
                'user': user_info.data,
                'refresh': refresh,
                'access': access,
                'check_alarm' : check_alarm,
                'uncheck_alarm' : uncheck_alarm
            }
            
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    '''회원가입'''
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

            # return Response(serializer.data)
        else:
            return Response(serializer.errors)


class ProfileDetail(APIView):
    '''마이프로필'''
    permission_classes = [IsTokenValid]

    def get(self, request, user_id):
        try:
            user = get_user_from_token(request) # 현재 로그인을 요청한 사용자

            # 로그인 한 유저와 요청한 유저가 같은 사람이면 (본인 프로필)
            if user.id == user_id:
                user_info = UserProfile.objects.get(id=user_id) # 유저 정보
                stories = Post.objects.filter(author=user).order_by('-created_at') # 유저가 썼던 스토리 글들 (공개, 나만보기, 기수공개 상관없이 전부)
                studies = Study.objects.filter(author=user).order_by('-created_at') # 자신이 게시했던 스터디. 프로젝트 글 목록
                total_count = stories.count() + studies.count() # 지금까지 썼던 게시글 총 개수
                
                user_profile = UserProfileSerializer(user_info) # 유저 정보 직렬화
                user_stories = PostSerializer(stories, many=True) # 유저가 썼던 스토리 직렬화
                user_studies = StudySerializer(studies, many=True) # 유저가 썼던 스터디, 프로젝트 직렬화

                data = {
                    "user_info" : user_profile.data,
                    "total_count" : total_count,
                    "user_stories" : user_stories.data,
                    "user_studies" : user_studies.data,
                }
                
            else:
                user_info = UserProfile.objects.get(id=user_id) # 해당 프로필 유저 정보
                stories = Post.objects.filter(author__id=user_id).order_by('-created_at') #  공개되어있는 게시물만 보여지도록 (아직 스토리 공개/비공개/기수보기 설정 안함 추후 수정 예정!)
                studies = Study.objects.filter(author__id=user_id, public_private='public').order_by('-created_at') # 공개되어있는 스터디, 프로젝트 게시물 보여지도록
                total_count = stories.count() + studies.count()  # 지금까지 썼던 게시글 총 개수

                user_profile = UserProfileSerializer(user_info) # 유저 정보 직렬화
                user_stories = PostSerializer(stories, many=True) # 유저가 썼던 스토리 직렬화
                user_studies = StudySerializer(studies, many=True) # 유저가 썼던 스터디 직렬화
                
                data = {
                    "user_info" : user_profile.data,
                    "total_count" : total_count,
                    "user_stories" : user_stories.data,
                    "user_studies" : user_studies.data,
                }

            return Response(data, status=status.HTTP_200_OK)
        
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        

class ProfileUpdateDelete(APIView):
    '''프로필 수정 및 삭제'''
    permission_classes = [IsTokenValid]

    def put(self, request):
        user = get_user_from_token(request) 
        user_profile = get_object_or_404(UserProfile, id = user.id)

        serializer = ProfileUpdateSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # 이미지 가져오기
            profile_img = request.FILES.get('profile_img')
            print(profile_img)

            # profile img 가 데이터에 포함되어있다면
            if profile_img:
                img_uploader = S3ImgUploader(profile_img) 
                uploaded_url = img_uploader.upload()  
                user_profile.profile_img = uploaded_url 
                user_profile.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        user = get_user_from_token(request) # 토큰 decode 통해 로그인 한 유저 담아주기
        profile = get_object_or_404(UserProfile, user=user)

        profile.delete()
        messages = {
            'success' : '회원을 탈퇴하였습니다.'
            }
        return Response(messages, status=status.HTTP_200_OK)
    

# --------------------------------- 관리자 기능 --------------------------------- #
class MemberList(APIView):
    '''전체 회원 리스트(멤버만) : 운영진만 접근 가능'''
    permission_classes = [IsAdminValid]
    
    def get(self, request):
        users = UserProfile.objects.filter(is_active=True)
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RegistrationRequestList(APIView):
    '''회원가입 요청 리스트(아직 활성화가 되지 않은 유저)'''
    permission_classes = [IsAdminValid]

    def get(self, request):
        request_users = UserProfile.objects.filter(is_active=False)
        serializer = UserProfileSerializer(request_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserActivate(APIView):
    '''유저 활성화(수동)'''
    permission_classes = [IsAdminValid]

    def post(self, request, user_id):
        try:
            user = UserProfile.objects.get(pk=user_id)
            user.is_active = True
            user.save()
            return Response({'message': 'User updated successfully'})
        except UserProfile.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminActivate(APIView):
    '''운영진 활성화'''
    permission_classes = [IsAdminValid]
    
    def post(self, request, user_id):
        try:
            user = UserProfile.objects.get(pk=user_id)
            user.is_admin = not user.is_admin
            user.save()
            return Response({'message': 'User updated successfully'})
        except UserProfile.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class UserDelete(APIView):
    '''회원탈퇴(운영진만)'''
    permission_classes = [IsAdminValid]

    def delete(self, request, user_id):
        try:
            user = UserProfile.objects.get(pk=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserProfile.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
class UserPostList(APIView):
    '''회원 게시물 관리'''
    permission_classes = [IsAdminValid]
		
    def get_user(self, user_id):
        try:
            user = UserProfile.objects.get(pk=user_id)
            return user
        except UserProfile.DoesNotExist:
            return None

    def get(self, request, user_id):
        user = self.get_user(user_id)
        if not user:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        stories = Post.objects.filter(author=user).order_by('-created_at') 
        studies = Study.objects.filter(author=user).order_by('-created_at') 

        user_stories = PostSerializer(stories, many=True)
        user_studies = StudySerializer(studies, many=True) 

        # 결과를 반환
        response_data = {
            'user_info': UserProfileSerializer(user).data,
            'user_stories': user_stories.data,
            'user_studies': user_studies.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)

class UserStoryDelete(APIView):
    '''회원 스토리 글 삭제'''
    permission_classes = [IsAdminValid]

    def delete(self, request, story_id):
        try:
            story = Post.objects.get(pk=story_id)
            story.delete()
            return Response({'detail': 'Story deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'detail': 'Story not found or you do not have permission to delete it'},
                            status=status.HTTP_404_NOT_FOUND)

class UserStudyDelete(APIView):
    '''회원 스터디 글 삭제'''
    permission_classes = [IsAdminValid]

    def delete(self, request, study_id):
        try:
            study = Study.objects.get(pk=study_id)
            study.delete()
            return Response({'detail': 'Study deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Study.DoesNotExist:
            return Response({'detail': 'Study not found or you do not have permission to delete it'},
                            status=status.HTTP_404_NOT_FOUND)