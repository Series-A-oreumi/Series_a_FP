from django.urls import path
from . import views

urlpatterns = [
    # study 
    path('', views.StudyList.as_view()), # 스터디 목록
    path('create/', views.StudyCreate.as_view()), # 스터디 생성
    path('<int:study_id>/', views.StudyDetail.as_view()), # 스터디 상세

    # comment
    path('<int:study_id>/comments', views.CommentCreate.as_view()), # 댓글 작성

]
