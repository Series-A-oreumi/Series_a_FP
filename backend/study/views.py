from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from .serializers import StudySerializer
from .models import Stack, Study
from user.models import UserProfile


# 스터디 목록 
class StudyList(APIView):

    permission_classes = [IsAuthenticated] # 로그인 한 유저만 가능

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

    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        # JWT 토큰에서 사용자 정보 디코드
        token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]  # JWT 토큰 추출
        access_token = AccessToken(token)
        user_id = access_token.payload['user_id']

         # 사용자 정보 가져오기
        try:
            user = UserProfile.objects.get(id=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': '사용자를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = StudySerializer(data=request.data)
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
    

# study 상세페이지

# study join 페이지? -> 회의필요!

# study edit & delete

# comment create

# comment edit & delete