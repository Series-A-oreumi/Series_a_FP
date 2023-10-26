from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentCreateSerializer, CommentSerializer, StudyCreateSerializer, StudyDetailSerializer, StudySerializer
from .models import Comment, Stack, Study
from user.models import UserProfile
from user.utils import get_user_from_token
from django.db import transaction



# studylist (API 테스트 정상작동)
class StudyList(APIView):

    # 로그인 한 유저만 가능
    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        try:
            studies = Study.objects.all().order_by('-created_at')
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)    

        # PostSerializer를 사용하여 직렬화
        serializer = StudySerializer(studies, many=True)  
        
        return Response(serializer.data, status=status.HTTP_200_OK)


# studycreate (API 테스트 정상작동) -> 프론트와 논의 필요!
class StudyCreate(APIView):

    # 로그인 한 유저만 접속가능
    permission_classes = [IsAuthenticated]
    
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
   
    permission_classes = [IsAuthenticated] # 로그인 한 유저만 가능

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

        # 조회수 증가
        if user != study.author: # 해당 게시글을 작성한 유저와 다르다면
            study.views += 1 # 조회수 1 증가
            study.save()
       
        serializer = StudyDetailSerializer(study)
        return Response(serializer.data)
    
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


# study join 페이지? -> 필요한지 회의 필요
class StudyJoin(APIView):
    pass

# comment create (API 테스트 정상작동)
class CommentCreate(APIView):
    permission_classes = [IsAuthenticated] # 로그인 한 유저만 접근가능
    
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