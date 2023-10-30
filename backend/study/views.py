from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user.serializers import UserProfileSerializer

from user.permissions import IsTokenValid
from .serializers import CommentCreateSerializer, CommentSerializer, StudyCreateSerializer, StudyDetailSerializer, StudySerializer, LikeSerializer
from .models import Comment, Like, Stack, Study
from user.models import UserProfile
from user.utils import get_user_from_token
from django.db import transaction



# studylist (API 테스트 정상작동)
class StudyList(APIView):

    # 로그인 한 유저만 가능
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def get(self, request):
        try:
            studies = Study.objects.all().order_by('-created_at')
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)    

        # 현재 요청한 유저 (로그인 되어있는 유저)
        user = get_user_from_token(request)
        user_serializer = UserProfileSerializer(user)

        # PostSerializer를 사용하여 직렬화
        study_serializer = StudySerializer(studies, many=True)  
        
        data = {
            'request_user' : user_serializer.data,
            'studylist' : study_serializer.data,
        }
        
        return Response(data, status=status.HTTP_200_OK)
    

# studycreate (API 테스트 정상작동) -> 프론트와 논의 필요!
class StudyCreate(APIView):

    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def post(self, request):
        
        # 요청한 유저 가져오기
        user = get_user_from_token(request)

         # "author" 필드를 직접 설정
        request.data["author"] = user.id

        serializer = StudyCreateSerializer(data=request.data)
        if serializer.is_valid():
            study = serializer.save()
            study.participants.set([user]) # participants 집어넣기

            # stacks 집어넣기
            stack_data = request.data.get('stacks')
            for stack_pk in stack_data:
                stack = Stack.objects.get(pk=stack_pk)
                study.stacks.add(stack)
        
            data = {
                "message" : "스터디 및 프로젝트 등록이 완료되었습니다.",
            }
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# study detail & edit & delete (API 테스트 정상작동) -> 수정부분은 프론트와 논의필요!
class StudyCreate(APIView):

    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def post(self, request):
        
        # 요청한 유저 가져오기
        user = get_user_from_token(request)

         # "author" 필드를 직접 설정
        request.data["author"] = user.id

        serializer = StudyCreateSerializer(data=request.data)
        if serializer.is_valid():
            study = serializer.save()
            study.participants.set([user]) # participants 집어넣기

            # stacks 집어넣기
            stack_data = request.data.get('stacks')
            for stack_pk in stack_data:
                stack = Stack.objects.get(pk=stack_pk)
                study.stacks.add(stack)
        
            data = {
                "message" : "스터디 및 프로젝트 등록이 완료되었습니다.",
            }
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# study detail & edit & delete (API 테스트 정상작동) -> 수정부분은 프론트와 논의필요!
class StudyDetail(APIView):
   
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def get_study(self, study_id):
        try:
            return Study.objects.get(pk=study_id)
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # 상세 스토리 게시글 들어가도록
    def get(self, request, study_id):
        study = self.get_study(study_id)
        if study is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # 요청한 유저 가져오기
        user = get_user_from_token(request)
        user_serializer = UserProfileSerializer(user)

        # 조회수 증가
        if user != study.author: # 해당 게시글을 작성한 유저와 다르다면
            study.views += 1 # 조회수 1 증가
            study.save()
       
        post_serializer = StudyDetailSerializer(study)

        data = {
            'request_user' : user_serializer.data,
            'study' : post_serializer.data
        }
        
        return Response(data, status=status.HTTP_200_OK )
    
    # 해당 스토리 게시글 수정
    def put(self, request, study_id):
        study = self.get_study(study_id)
        if study is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if study.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = StudyCreateSerializer(study, data=request.data, partial=True) # partial = True -> 부분적으로 수정가능하도록!

        if serializer.is_valid():
            serializer.save()

           # 스택 업데이트
            stack_data = request.data.get('stacks')
            try:
                with transaction.atomic():
                    study.stacks.clear()  # 이전 스택 삭제
                    for stack_pk in stack_data:
                        try:
                            stack = Stack.objects.get(pk = stack_pk)
                            study.stacks.add(stack) 
                        except Stack.DoesNotExist:
                            # 스택이 존재하지 않을 경우 예외 처리
                            pass
                    study.save()
            except Exception as e:
                return Response({"message": "스터디 스택을 업데이트하는 중 오류가 발생했습니다."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 해당 스토리 게시글 삭제
    def delete(self, request, study_id):
        study = self.get_study(study_id)
        if study is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 요청한 유저 가져오기
        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if study.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        study.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# study search 
class StudySearch(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def get(self, request):
        search_query = request.GET.get('search', '') # 쿼리스트링 url에서 검색어 가져오기
        print(search_query)
        if search_query:
            # 유저 검색
            results = Study.objects.filter(
                                          Q(author__username__icontains=search_query)|
                                          Q(author__nickname__icontains=search_query)|
                                          Q(title__icontains=search_query)|
                                          Q(content__icontains=search_query)
                                        )
            serializer = StudySerializer(results, many=True)

            return Response(serializer.data)
        
        messages = {
                'Not Found' : '검색 결과가 없습니다'
                }
        return Response(messages)
    


# study join 페이지? -> 필요한지 회의 필요
class StudyJoin(APIView):
    pass

# comment create (API 테스트 정상작동)
class CommentCreate(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용
    
    def get(self, request, study_id):
        try:
            study_comments = Comment.objects.filter(study_id=study_id)
            serializer = CommentSerializer(study_comments, many=True)
            return Response(serializer.data)
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    # 댓글 작성
    def post(self, request, study_id):
         # 게시물 가져오기
        try:
            study = Study.objects.get(pk=study_id)
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # CreateCommentSerializer 사용하여 입력받은 content를 직렬화(json->python)
        serializer = CommentCreateSerializer(data=request.data)
        user = get_user_from_token(request)

        if serializer.is_valid():
            serializer.save(study=study, author=user)

            messages = {
                'success' : '댓글이 작성되었습니다.'
            }
            return Response(messages, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
# comment edit & delete (API 테스트 정상작동)
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
        messages = {
            'success' : '댓글이 정상적으로 삭제되었습니다.'
        }
        return Response(messages, status=status.HTTP_204_NO_CONTENT)
    

# like
class ToggleLike(APIView):
    permission_classes = [IsTokenValid]  # IsTokenValid 권한을 적용

    def post(self, request, study_id):
        study = get_object_or_404(Study, pk=study_id)

        user = get_user_from_token(request)
        
        try:
            like = Like.objects.get(user=user, study=study)
            # 이미 좋아요를 누른 경우, 좋아요를 취소합니다.
            if like.liked:
                like.delete()
                study.likes.remove(user)
                messages = {
                    'cancel' : f'{study.author} 게시물 좋아요를 취소했습니다.' 
                }
                return Response(messages, status=status.HTTP_204_NO_CONTENT)
            # 좋아요를 누르지 않았던 경우, 좋아요를 추가합니다.
            else:
                like.liked = True
                like.save()
                study.likes.add(user)
                messages = {
                    'success' : f'{study.author} 게시물 좋아요를 눌렀습니다.' 
                }
                return Response(messages, status=status.HTTP_201_CREATED)
            
        except Like.DoesNotExist:
            # 좋아요를 누르지 않았던 경우, 좋아요를 추가합니다.
            like = Like(user=user, study=study, liked=True)
            like.save()
            serializer = LikeSerializer(like)
            return Response(serializer.data, status=status.HTTP_201_CREATED)