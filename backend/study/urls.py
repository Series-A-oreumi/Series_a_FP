from django.urls import path
from . import views

urlpatterns = [
    # study 
    path('', views.StudyList.as_view()), # 스터디 목록
    path('create/', views.StudyCreate.as_view()), # 스터디 생성
    path('<int:study_id>/', views.StudyDetail.as_view()), # 스터디 상세 & 수정 & 삭제

    # comment
    path('<int:study_id>/comments/', views.CommentCreate.as_view()), # 댓글 작성
    path('comments/<int:comment_id>/', views.CommentUpdateDelete.as_view()), # 댓글 수정 & 삭제

]
