from django.urls import path
from . import views

urlpatterns = [
    path('', views.StudyList.as_view()), # 스터디 목록
    path('create/', views.StudyCreate.as_view()), # 스터디 생성
]
