from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notifications
from story.models import Post, Like
from study.models import Study, Like
from .serializers import NotificationSerializer
from user.permissions import IsTokenValid
from datetime import datetime
from django.http import JsonResponse
from user.utils import  get_user_from_token


# Create your views here.

class NotificationCreate (APIView):
    # 로그인 한 유저만 가능
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def post(self, request):
        print("Notification_post")
        content = request.data.get('content')
        notifications = Notifications(content=content)
        notifications.save()
        serializer = NotificationSerializer(notifications)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def get(self,request):
        print("Notification_get")
        notifications = Notifications.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CommentCreateAPIView(APIView):
    permission_classes = [IsTokenValid]

    def post(self, request, study_id, story_id):
        print("Comment_post")
        # 사용자로부터 댓글 내용을 받아옵니다.
        content = request.data.get('content')
        article_type = request.data.get('article_type')  # 'study' 또는 'story'
        article_id = request.data.get('article_id')  # 게시물의 ID
        user = get_user_from_token(request)

        # 실제로 댓글을 생성하고 데이터베이스에 저장하는 코드 (예시)
        # Comment 모델이 있다고 가정하고 사용자 입력을 활용하여 댓글을 생성합니다.
        # 새로운 댓글을 데이터베이스에 저장하고 study_id와 연결합니다.
        new_comment = Notifications.objects.create(content=content, category_article=article_type, article_num=article_id, user=user)

        if article_type == 'study':
            try:
                study = Study.objects.get(id=article_id)
                story.comments.add(new_comment)

                # 작성자와 댓글 작성자가 다를 경우에만 실행
                if study.user != user:
                    study.comments.add(new_comment)
                    
                    # 알림 생성 및 저장
                    category_article = "study"
                    article_num = study_id
                    category_likecomment = "comment"
                    content = "새로운 댓글이 달렸습니다!"
                    created_at = datetime.now()

                    Notifications.objects.create(
                        user_id=user.id,
                        category_article=category_article,
                        article_num=article_num,
                        category_likecomment=category_likecomment,
                        content=content,
                        created_at=created_at
                    )

                    return JsonResponse({'success': 'Comment and notification created successfully'})
                else:
                    return JsonResponse({'error': 'Cannot add comment to your own study'}, status=status.HTTP_400_BAD_REQUEST)
            except Study.DoesNotExist:
                # 해당 ID에 해당하는 Study 게시물이 존재하지 않는 경우의 처리
                pass
        # article_type이 'story'인 경우 Story 모델에 댓글 추가
        elif article_type == 'story':
            #작성자와 댓글 작성자가 다를경우 실행
            try:
                story = Post.objects.get(id=article_id)
                story.comments.add(new_comment)
            # 작성자와 댓글 작성자가 다를 경우에만 실행
                if story.user != user:
                    story.comments.add(new_comment)
                    
                    # 알림 생성 및 저장
                    category_article = "post"
                    article_num = story_id
                    category_likecomment = "comment"
                    content = "새로운 댓글이 달렸습니다!"
                    created_at = datetime.now()

                    Notifications.objects.create(
                        user_id=user.id,
                        category_article=category_article,
                        article_num=article_num,
                        category_likecomment=category_likecomment,
                        content=content,
                        created_at=created_at
                    )

                    return JsonResponse({'success': 'Comment and notification created successfully'})
                else:
                    return JsonResponse({'error': 'Cannot add comment to your own study'}, status=status.HTTP_400_BAD_REQUEST)
            except Study.DoesNotExist:
                # 해당 ID에 해당하는 Study 게시물이 존재하지 않는 경우의 처리
                pass

        # 알림 생성 및 저장
        # category_article = "study"  # 또는 "story" (댓글이 달린 게시글의 유형)
        # article_num = study_id  # 댓글이 달린 게시글의 ID
        # category_likecomment = "comment"
        # content = "새로운 댓글이 달렸습니다!"
        # created_at = datetime.now()  # 현재 시간을 사용하여 알림 생성 시간 기록

        # Notifications.objects.create(
        #     user_id=user.id,
        #     category_article=category_article,
        #     article_num=article_num,
        #     category_likecomment=category_likecomment,
        #     content=content,
        #     created_at=created_at
        # )

        # 알림 정보를 클라이언트에게 반환
        # return JsonResponse({'success': 'Comment and notification created successfully'})
        
class LikeView(APIView):
    permission_classes = [IsTokenValid]

    def post(self, request, *args, **kwargs):
        print("Like_post")
        # 좋아요를 누른 사용자의 ID를 가져옵니다.
        user = get_user_from_token(request)

        # article_type이 'study'이면 Study 모델에서, 'story'이면 Story 모델에서 게시물을 가져옵니다.
        article_type = request.data.get('article_type')
        article_id = request.data.get('article_id')

        if article_type == 'study':
            try:
                study = Study.objects.get(id=article_id)
                # Study 모델에서 게시물을 가져왔으므로 이를 사용할 수 있습니다.
            except Study.DoesNotExist:
                # 해당 ID에 해당하는 Study 게시물이 존재하지 않는 경우의 처리
                return JsonResponse({'error': 'Study not found'}, status=status.HTTP_404_NOT_FOUND)
        elif article_type == 'story':
            try:
                story = Post.objects.get(id=article_id)
                # Story 모델에서 게시물을 가져왔으므로 이를 사용할 수 있습니다.
            except Post.DoesNotExist:
                # 해당 ID에 해당하는 Story 게시물이 존재하지 않는 경우의 처리
                return JsonResponse({'error': 'Story not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # 유효하지 않은 article_type 값에 대한 처리
            return JsonResponse({'error': 'Invalid article_type'}, status=status.HTTP_400_BAD_REQUEST)

        # 좋아요를 생성합니다.
        Like.objects.create(user_id=user.id, study=study)
        
        # 알림을 생성합니다.
        Notifications.objects.create(
            user_id=user.id,
            category_article='like',
            article_num=article_id,
            category_likecomment='like',  # 좋아요인 경우에는 'like'로 설정
            content='Someone liked your post.',
        )

        return JsonResponse({'success': 'Like created successfully'}, status=status.HTTP_201_CREATED)

# class CommentCreateAPIView(APIView):

#     permission_classes = [IsTokenValid]
#     def post(self, request, study_id):
#         # 댓글 생성 코드 (이미 가지고 있음)

#         # 알림 생성 및 저장
#         notification_content = '새로운 댓글이 달렸습니다!'
#         notifications = Notifications(content=notification_content, study_id=study_id)
#         notifications.save()

#         # 알림 정보를 클라이언트에게 반환
#         serializer = NotificationSerializer(notifications)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

# class LikeView(generics.CreateAPIView):
#     serializer_class = NotificationSerializer

#     def post(self, request, *args, **kwargs):
#         # 좋아요를 누른 사용자의 ID를 가져옵니다.
#         user_id = request.user.id

#         # article_type이 'study'이면 Study 모델에서, 'story'이면 Story 모델에서 게시물을 가져옵니다.
#         article_type = request.data.get('article_type')
#         article_id = request.data.get('article_id')

#         if article_type == 'study':
#             try:
#                 study = Study.objects.get(id=article_id)
#                 # Study 모델에서 게시물을 가져왔으므로 이를 사용할 수 있습니다.
#             except Study.DoesNotExist:
#                 # 해당 ID에 해당하는 Study 게시물이 존재하지 않는 경우의 처리
#                 pass
#         elif article_type == 'story':
#             try:
#                 story = Post.objects.get(id=article_id)
#                 # Story 모델에서 게시물을 가져왔으므로 이를 사용할 수 있습니다.
#             except Post.DoesNotExist:
#                 # 해당 ID에 해당하는 Story 게시물이 존재하지 않는 경우의 처리
#                 pass
#         else:
#             # 유효하지 않은 article_type 값에 대한 처리
#             pass
#         # 좋아요를 생성합니다.
#         like = Like.objects.create(user_id=user_id, study=study)
#         # (좋아요 생성 로직)

#         # 알림을 생성합니다.
#         Notifications.objects.create(
#             user_id=user_id,
#             category_article='like',
#             article_num=article_id,
#             content='Someone liked your post.',
#         )

#         return Response({'success': 'Like created successfully'}, status=status.HTTP_201_CREATED)