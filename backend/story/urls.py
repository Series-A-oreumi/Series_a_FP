from django.urls import path
from . import views

urlpatterns = [
    # story
    path('', views.StoryList.as_view()), # 스토리 게시글 목록
    path('create/', views.StoryPost.as_view()), # 스토리 게시글 생성
    path('<int:post_id>/', views.StoryDetail.as_view()), # 스토리 상세 게시물 (update, delete)

    # comment
    path('<int:post_id>/commentlist/', views.CommentList.as_view()), # 게시물에 댓글 생성
    path('<int:post_id>/comments/', views.CommentCreate.as_view()), # 게시물에 댓글 생성
    path('comments/<int:comment_id>/', views.CommentUpdateDelete.as_view()), # 게시물에 댓글 수정 및 삭제
    
    # like
    path('liked/<int:post_id>/', views.ToggleLike.as_view()), # 좋아요 기능

    # search
    path('search/', views.StorySearch.as_view()), # 스토리 검색기능
]
