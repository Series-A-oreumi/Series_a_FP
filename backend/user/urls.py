from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    # user register & login
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),

    # userprofile
    path('profile/', ProfileUpdateDelete.as_view()), # update & delete
    path('profile/<int:user_id>/', ProfileDetail.as_view()), # detail


    # jwt-token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # 토큰 재발급을 위한 url
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # admin
    path('admin/members/', MemberList.as_view()), # 전체 회원 리스트
    path('admin/register/', RegistrationRequestList.as_view()), # 회원가입 요청을 보낸 유저리스트
    path('admin/user-activate/<int:user_id>/', UserActivate.as_view()), # 유저 활성화
    path('admin/admin-activate/<int:user_id>/', AdminActivate.as_view()), # 관리자 활성화
    path('admin/<int:user_id>/delete/', UserDelete.as_view()), # 회원탈퇴
    path('admin/posts/<int:user_id>/', UserPostList.as_view()), # 각 회원의 게시물 리스트
    path('admin/posts/<int:user_id>/story/<int:story_id>/delete/', UserStoryDelete.as_view()), # 스토리 삭제
    path('admin/posts/<int:user_id>/study/<int:study_id>/delete/', UserStudyDelete.as_view()), # 스터디 삭제
]