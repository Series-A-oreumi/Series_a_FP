from django.shortcuts import get_object_or_404
from django.db.models import Q
from user.serializers import UserProfileSerializer
from .models import Like, Post, Comment, Hashtag, PostImage
from user.models import UserProfile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .serializers import CommentSerializer, CreateCommentSerializer,LikeSerializer, PostDetailSerializer , PostSerializer
from user.utils import get_user_from_token, S3ImgUploader
from user.permissions import IsTokenValid  # 커스텀 권한 클래스 임포트

# story list
class StoryList(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def get(self, request):
        try:
            user = get_user_from_token(request) # 현재 로그인 한 사용자
            posts = Post.objects.all().order_by('-created_at')[:30]

            if user:
                # posts 중에서 (public or author = 현재 로그인 한 사용자)인 게시물만 가져오기
                posts = [
                    post for post in posts if post.is_public or post.author == user
                ]
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # 현재 로그인 한 유저 직렬화
        user_serializer = UserProfileSerializer(user)

        # PostSerializer를 사용하여 직렬화
        story_serializer = PostSerializer(posts, many=True)  
        
        data = {
            'request_user' : user_serializer.data,
            'storylist' : story_serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)

# story post
class StoryPost(CreateAPIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def post(self, request, format=None):

       # 요청한 유저 가져오기
        user = get_user_from_token(request)
        
        # 이미지 가져오기
        images = request.FILES.getlist('images') # 이미지는 request.data가 아닌 request.FILES로 불러오기
        
        # post 생성 (직접할당)
        post = Post.objects.create(author=user, title=request.data['title'], content=request.data['content'])

        # 이미지 저장
        for image in images:
            img_upload = S3ImgUploader(image) # S3ImgUploader class 담기
            img = img_upload.upload() # upload 메소드 실행
            PostImage.objects.create(post=post, images=img)

        message = {
            "success" : "게시물이 성공적으로 생성되었습니다."
        }

        return Response(message, status=status.HTTP_201_CREATED)
    

# story search
class StorySearch(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def get(self, request):
        search_query = request.GET.get('search', '') # 쿼리스트링 url에서 검색어 가져오기
        print(search_query)
        if search_query:
            # 유저 검색
            users_result = UserProfile.objects.filter(
                                                     Q(username__icontains=search_query) 
                                                    |Q(nickname__icontains=search_query)
                                                     )
            user_serializer = UserProfileSerializer(users_result, many=True)

             # 검색어와 관련된 해시태그를 찾음
            hashtags = Hashtag.objects.filter(name__icontains=search_query)

            # 검색된 해시태그를 가지고 있는 게시물을 찾음
            posts_result = Post.objects.filter(hashtags__in=hashtags)

            post_serializer = PostSerializer(posts_result, many=True)

            # 검색 결과를 하나의 데이터 구조로 조합
            search_results = {
                "users": user_serializer.data,
                "posts": post_serializer.data,
            }

            return Response(search_results)
        messages = {
            'Not Found' : '검색 결과가 없습니다'
        }
        return Response(messages)
    
# class StoryPost(APIView): 
#     permission_classes = (IsAuthenticatedOrReadOnly,)

#     # 스토리 게시글 작성
#     def post(self, request):

#         # 클라이언트에서 보낸 해시태그 이름을 리스트로 가져오기
#         hashtag_names = request.data.get('hashtags', [])

#         hashtags = []
#         for hashtag_name in hashtag_names:
#             # 해시태그 모델에서 검색하거나 생성
#             hashtag, created = Hashtag.objects.get_or_create(name=hashtag_name)
#             hashtags.append(hashtag)

#         try:
#             author = User.objects.get(pk=request.user.pk) # 현재 요청한 유저
#         except User.DoesNotExist:
#             author = None

#         if author is not None:
#             post = Post(
#                 author=author,
#                 images=request.FILES["images"],
#                 title=request.data.get('title'),
#                 content=request.data.get('content'),
#             )
#             post.save() # 데이터 저장

#             # ManyToMany 필드에 해시태그를 할당할 때 .set() 메서드를 사용
#             post.hashtags.set(hashtags)

#              # 게시물 정보를 JSON 형식으로 응답
#             response_data = {
#                 'id': post.id,
#                 'author': post.author.username,
#                 'images': post.images,  # 이미지 파일 URL
#                 'title': post.title,
#                 'content': post.content,
#                 'hashtags': [hashtag.name for hashtag in post.hashtags.all()]  # 해시태그 목록
#             }

#             return Response(data=response_data, status=status.HTTP_201_CREATED)
#         return Response(status=status.HTTP_404_NOT_FOUND,
#                         data={"error": "Invalid pk values"})

# story detail
class StoryDetail(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def get_post(self, post_id):
        try:
            return Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # 상세 스토리 게시글 들어가도록
    def get(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # 요청한 유저 가져오기
        user = get_user_from_token(request)

        # 조회수 증가
        if user != post.author: # 해당 게시글을 작성한 유저와 다르다면
            post.views += 1 # 조회수 1 증가
            post.save()

        # 현재 로그인 한 유저 직렬화
        user_serializer = UserProfileSerializer(user)
        
        story_serializer = PostDetailSerializer(post)

        data = {
            'request_user' : user_serializer.data,
            'story' : story_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

    # 해당 스토리 게시글 수정
    def put(self, request, post_id):
        post = self.get_post(post_id)
        if post is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if post.author != user:
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

        # 요청한 유저 가져오기
        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if post.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# like
class ToggleLike(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)

        user = get_user_from_token(request)
        
        try:
            like = Like.objects.get(user=user, post=post)
            # 이미 좋아요를 누른 경우, 좋아요를 취소합니다.
            if like.liked:
                like.delete()
                post.likes.remove(user)
                messages = {
                    'success' : f'{post.author} 게시물 좋아요를 취소했습니다.' 
                }
                return Response(messages, status=status.HTTP_204_NO_CONTENT)
            # 좋아요를 누르지 않았던 경우, 좋아요를 추가합니다.
            else:
                like.liked = True
                like.save()
                post.likes.add(user)
                messages = {
                    'success' : f'{post.author} 게시물 좋아요를 눌렀습니다.' 
                }
                return Response(messages, status=status.HTTP_201_CREATED)
            
        except Like.DoesNotExist:
            # 좋아요를 누르지 않았던 경우, 좋아요를 추가합니다.
            like = Like(user=user, post=post, liked=True)
            like.save()
            serializer = LikeSerializer(like)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

# comment create
class CommentCreate(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    # 댓글 작성
    def post(self, request, post_id):
         # 게시물 가져오기
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # CreateCommentSerializer 사용하여 입력받은 content를 직렬화(json->python)
        serializer = CreateCommentSerializer(data=request.data)

        if serializer.is_valid():
            content = serializer.validated_data['content']
            
            # parent_comment 필드를 입력받았는지 확인
            parent_comment_id = request.data.get('parent_comment')

            user = get_user_from_token(request)

            # 대댓글이라면
            if parent_comment_id:
                try:
                    parent_comment = Comment.objects.get(pk=parent_comment_id)
                except Comment.DoesNotExist:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "부모 댓글을 찾을 수 없습니다."})
                

                comment = Comment(
                    author=user,
                    post=post,
                    content=content,
                    parent_comment=parent_comment
                )

            # 대댓글이 아닌 기본 댓글이라면
            else:
                comment = Comment(
                    author=user,
                    post=post,
                    content=content
                )

            comment.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

# comment update&delete
class CommentUpdateDelete(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

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
        
        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 댓글의 작성자인지 확인
        if comment.author != user:
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

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 댓글의 작성자인지 확인
        if comment.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    









