from django.shortcuts import get_object_or_404
from .models import Post, Comment, Hashtag
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import CommentSerializer, CreateCommentSerializer, CreatePostSerializer , PostSerializer


class StoryPost(APIView): 

    permission_classes = [IsAuthenticated]  # 로그인 한 유저만 가능

    # 스토리 게시글 목록
    def get(self, request): 
        posts = Post.objects.all().order_by('-created_at')[:30]

        # PostSerializer를 사용하여 직렬화
        serializer = PostSerializer(posts, many=True)  
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # 스토리 게시글 작성
    def post(self, request):

        # 클라이언트에서 보낸 해시태그 이름을 리스트로 가져오기
        hashtag_names = request.data.get('hashtags', [])

        hashtags = []
        for hashtag_name in hashtag_names:
            # 해시태그 모델에서 검색하거나 생성
            hashtag, created = Hashtag.objects.get_or_create(name=hashtag_name)
            hashtags.append(hashtag)

        try:
            author = User.objects.get(pk=request.user.pk) # 현재 요청한 유저
        except User.DoesNotExist:
            author = None

        if author is not None:
            post = Post(
                author=author,
                images=request.FILES["images"],
                title=request.data.get('title'),
                content=request.data.get('content'),
            )
            post.save() # 데이터 저장

            # ManyToMany 필드에 해시태그를 할당할 때 .set() 메서드를 사용
            post.hashtags.set(hashtags)

             # 게시물 정보를 JSON 형식으로 응답
            response_data = {
                'id': post.id,
                'author': post.author.username,
                'images': post.images,  # 이미지 파일 URL
                'title': post.title,
                'content': post.content,
                'hashtags': [hashtag.name for hashtag in post.hashtags.all()]  # 해시태그 목록
            }

            return Response(data=response_data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_404_NOT_FOUND,
                        data={"error": "Invalid pk values"})
    
class StoryUpdateDelete(APIView):
    permission_classes = [IsAuthenticated] # 로그인 한 유저만 가능

    def get_post(self, post_id):
        try:
            return Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return None

    # 상세 스토리 게시글 들어가도록
    def get(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # 조회수 증가
        if request.user != post.author: # 해당 게시글을 작성한 유저와 다르다면
            post.views += 1 # 조회수 1 증가
            post.save()
       
        serializer = PostSerializer(post)
        return Response(serializer.data)

    # 해당 스토리 게시글 수정
    def put(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data, partial=True) # partial = True -> 부분적으로 수정가능하도록!

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 해당 스토리 게시글 삭제
    def delete(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CommentCreate(APIView):
    permission_classes = [IsAuthenticated] # 로그인 한 유저만 접근가능
    
    # 댓글 작성
    def post(self, request, post_id):
         # 게시물 가져오기
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # CreateCommentSerializer 사용하여 content를 입력받음
        serializer = CreateCommentSerializer(data=request.data)

        if serializer.is_valid():
            content = serializer.validated_data['content']
            
            # parent_comment 필드를 입력받았는지 확인
            parent_comment_id = request.data.get('parent_comment')

            # 대댓글이라면
            if parent_comment_id:
                try:
                    parent_comment = Comment.objects.get(pk=parent_comment_id)
                except Comment.DoesNotExist:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "부모 댓글을 찾을 수 없습니다."})

                comment = Comment(
                    author=request.user,
                    post=post,
                    content=content,
                    parent_comment=parent_comment
                )

            # 대댓글이 아닌 기본 댓글이라면
            else:
                comment = Comment(
                    author=request.user,
                    post=post,
                    content=content
                )

            comment.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class CommentUpdateDelete(APIView):
    permission_classes = [IsAuthenticated]

    def get_comment(self, comment_id):
        try:
            return Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return None

    # 댓글 수정
    def put(self, request, comment_id):
        comment = self.get_comment(comment_id)
        if comment is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 권한 확인: 현재 사용자가 댓글의 작성자인지 확인
        if comment.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(comment, data=request.data, partial=True) # partial = True -> 부분적으로 수정가능하도록!)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 댓글 삭제
    def delete(self, request, comment_id):
        comment = self.get_comment(comment_id)
        if comment is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 권한 확인: 현재 사용자가 댓글의 작성자인지 확인
        if comment.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class Like(APIView):
    
    # 좋아요 기능
    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)

        # 현재 사용자
        user = request.user

        # 게시물에 대한 좋아요를 추가하거나 이미 좋아요가 있는 경우 취소
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"detail": "Post like removed successfully."}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)
            return Response({"detail": "Post liked successfully."}, status=status.HTTP_201_CREATED)








