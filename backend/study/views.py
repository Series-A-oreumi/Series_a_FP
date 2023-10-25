from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentCreateSerializer, StudyCreateSerializer, StudyDetailSerializer, StudySerializer
from .models import Stack, Study
from user.models import UserProfile
from user.utils import get_user_from_token


# 스터디 목록 
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


# 스터디 생성
class StudyCreate(APIView):

    # 로그인 한 유저만 접속가능
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        # 요청한 유저 가져오기
        user = get_user_from_token(request)

        serializer = StudyCreateSerializer(data=request.data)
        if serializer.is_valid():
            study = serializer.save(author=user)
            study.participants.set([user]) # participants 집어넣기

            # stacks 집어넣기
            stack_data = request.data.get('stacks')
            for stack_name in stack_data:
                stack, _ = Stack.objects.get_or_create(name=stack_name)
                study.stacks.add(stack)
        
            data = {
                "message" : "스터디 등록이 완료되었습니다.",
            }
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# study detail
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

# study join 페이지? -> 회의필요!

# study edit & delete

# comment create
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
    
# comment edit & delete