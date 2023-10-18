from django.urls import path
from . import views

urlpatterns = [
    path('', views.StoryPost.as_view()), # 스토리 게시글 목록 및 작성
    path('<int:post_id>/', views.StoryUpdateDelete.as_view()), # 스토리 상세 게시물 (update, delete)
    path('<int:post_id>/comments', views.CommentCreate.as_view()), # 게시물에 댓글 생성
    path('comments/<int:comment_id>', views.CommentUpdateDelete.as_view()), # 게시물에 댓글 수정 및 삭제
    path('like/<int:post_id>/', views.Like.as_view()), # 좋아요
]
