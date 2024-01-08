from django.shortcuts import get_object_or_404
from .models import Like, Post, Comment, Hashtag, PostImage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .serializers import (
    CommentSerializer,
    CreateCommentSerializer,
    LikeSerializer,
    PostDetailSerializer,
    PostSerializer,
)
from user.serializers import UserProfileSerializer
from user.models import UserProfile
from user.utils import get_user_from_token, S3ImgUploader
from user.permissions import IsTokenValid 


class StoryList(APIView):
    '''스토리 리스트'''
    permission_classes = [IsTokenValid]

    def get(self, request):
        try:
            user = get_user_from_token(request) 
            posts = Post.objects.all().order_by("-created_at")[:30]

            if user:
                # posts 중에서 (public or author = 현재 로그인 한 사용자)인 게시물만 가져오기
                posts = [post for post in posts if post.is_public or post.author == user]
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StoryPost(CreateAPIView):
    '''스토리 게시'''
    permission_classes = [IsTokenValid] 

    def post(self, request, format=None):
        user = get_user_from_token(request)

        # 이미지는 request.data가 아닌 request.FILES로 불러오기
        images = request.FILES.getlist("images")  

        post = Post.objects.create(
            author=user, title=request.data["title"], content=request.data["content"]
        )

        if images:
            for image in images:
                img_upload = S3ImgUploader(image)
                img = img_upload.upload() 
                PostImage.objects.create(post=post, images=img)

        message = {"success": "게시물이 성공적으로 생성되었습니다."}
        return Response(message, status=status.HTTP_201_CREATED)


class StorySearch(APIView):
    '''스토리 검색 (사이드 바 검색)'''
    permission_classes = [IsTokenValid]

    def get(self, request):
       users  = UserProfile.objects.all()
       serializer = UserProfileSerializer(users, many=True)
       return Response(serializer.data, status=status.HTTP_200_OK)


class StoryDetail(APIView):
    '''스토리 상세'''
    permission_classes = [IsTokenValid]  

    def get_post(self, post_id):
        try:
            return Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 조회수 증가
        if user != post.author:  
            post.views += 1 
            post.save()

        serializer = PostDetailSerializer(post)
        return Response(serializer.data)


    def put(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if post.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data, partial=True) 

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   
    def delete(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if post.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ToggleLike(APIView):
    '''스토리 좋아요'''
    permission_classes = [IsTokenValid]

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        user = get_user_from_token(request)

        try:
            like = Like.objects.get(user=user, post=post)
            if like.liked:
                like.delete()
                post.likes.remove(user)
                likes_count = post.likes.count()
                return Response({"likes_count": likes_count}, status=status.HTTP_200_OK)
            else:
                like.liked = True
                like.save()
                post.likes.add(user)
                # 좋아요 추가 후 직접 좋아요 개수를 업데이트합니다.
                likes_count = post.likes.count()
                return Response({"likes_count": likes_count}, status=status.HTTP_201_CREATED)

        except Like.DoesNotExist:
            like = Like(user=user, post=post, liked=True)
            like.save()
            post.likes.add(user)
            serializer = LikeSerializer(like)
            likes_count = post.likes.count()
            return Response({"likes_count": likes_count}, status=status.HTTP_201_CREATED)

class CommentList(APIView):
    '''스토리 댓글 리스트'''
    permission_classes = [IsTokenValid] 
    
    def get(self, request, post_id):
        try:
            story_comments = Comment.objects.filter(post_id=post_id)
            serializer = CommentSerializer(story_comments, many=True)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class CommentCreate(APIView):
    '''스토리 댓글 작성'''
    permission_classes = [IsTokenValid] 

    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CreateCommentSerializer(data=request.data)

        if serializer.is_valid():
            content = serializer.validated_data["content"]

            # parent_comment 필드를 입력받았는지 확인
            parent_comment_id = request.data.get("parent_comment")

            user = get_user_from_token(request)

            # 대댓글이라면
            if parent_comment_id:
                try:
                    parent_comment = Comment.objects.get(pk=parent_comment_id)
                except Comment.DoesNotExist:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST, data={"message": "부모 댓글을 찾을 수 없습니다."}
                    )

                comment = Comment(
                    author=user, post=post, content=content, parent_comment=parent_comment
                )

            # 대댓글이 아닌 기본 댓글이라면
            else:
                comment = Comment(author=user, post=post, content=content)

            comment.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CommentUpdateDelete(APIView):
    '''스토리 댓글 수정 및 삭제'''
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def get_comment(self, comment_id):
        try:
            return Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return None

    def put(self, request, comment_id):
        comment = self.get_comment(comment_id)
        if comment is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 댓글의 작성자인지 확인
        if comment.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(comment, data=request.data, partial=True)  

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        comment = self.get_comment(comment_id)
        if comment is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 댓글의 작성자인지 확인
        if comment.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)