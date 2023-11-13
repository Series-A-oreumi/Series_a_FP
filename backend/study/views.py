from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Comment, Like, Stack, Study
from .serializers import CommentCreateSerializer, CommentSerializer, StudyCreateSerializer, StudyDetailSerializer, StudySerializer
from study.serializers import LikeSerializer
from user.serializers import UserProfileSerializer
from user.permissions import IsTokenValid
from user.models import UserProfile
from user.utils import get_user_from_token
from django.db import transaction


class StudyList(APIView):
    '''스터디 리스트'''
    permission_classes = [IsTokenValid] 
    
    def get(self, request):
        try:
            studies = Study.objects.all().order_by('-created_at')
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)    

        user = get_user_from_token(request)
        user_serializer = UserProfileSerializer(user)

        study_serializer = StudySerializer(studies, many=True)  
        
        data = {
            'request_user' : user_serializer.data,
            'studylist' : study_serializer.data,
        }
        
        return Response(data, status=status.HTTP_200_OK)
    

class StudyCreate(APIView):
    '''스터디 작성'''
    
    permission_classes = [IsTokenValid] 
    
    def post(self, request):
        
        user = get_user_from_token(request)

         # "author" 필드를 직접 설정
        request.data["author"] = user.id
        
        serializer = StudyCreateSerializer(data=request.data)
        if serializer.is_valid():
            study = serializer.save()
            study.participants.set([user]) # participants 집어넣기

            stack_data = request.data.get('stacks')
            for stack_pk in stack_data:
                stack = Stack.objects.get(pk=stack_pk)
                study.stacks.add(stack)
        
            data = {
                "message" : "스터디 및 프로젝트 등록이 완료되었습니다.",
            }
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class StudyDetail(APIView):
    '''study detail & edit & delete'''
    permission_classes = [IsTokenValid]  

    def get_study(self, study_id):
        try:
            return Study.objects.get(pk=study_id)
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, study_id):
        study = self.get_study(study_id)
        if study is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user = get_user_from_token(request)
        user_serializer = UserProfileSerializer(user)

        # 조회수 증가
        if user != study.author: 
            study.views += 1 
            study.save()
       
        post_serializer = StudyDetailSerializer(study)

        data = {
            'request_user' : user_serializer.data,
            'study' : post_serializer.data
        }
        
        return Response(data, status=status.HTTP_200_OK)
    

    def put(self, request, study_id):
        study = self.get_study(study_id)
        if study is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if study.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = StudyCreateSerializer(study, data=request.data, partial=True) 

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

 
    def delete(self, request, study_id):
        study = self.get_study(study_id)
        if study is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = get_user_from_token(request)

        # 권한 확인: 현재 사용자가 게시물의 작성자인지 확인
        if study.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        study.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StudySearch(APIView):
    '''스터디 검색'''
    permission_classes = [IsTokenValid] 

    def get(self, request):
        search_query = request.GET.get('search', '')
        print(search_query)
        if search_query:
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
    


class StudyJoin(APIView):
    '''스터디 참가'''
    pass


class CommentCreate(APIView):
    '''스터디 댓글 생성'''
    permission_classes = [IsTokenValid]
    
    def get(self, request, study_id):
        try:
            study_comments = Comment.objects.filter(study_id=study_id)
            serializer = CommentSerializer(study_comments, many=True)
            return Response(serializer.data)
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, study_id):
        try:
            study = Study.objects.get(pk=study_id)
        except Study.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommentCreateSerializer(data=request.data)
        user = get_user_from_token(request)

        if serializer.is_valid():
            serializer.save(study=study, author=user)

            messages = {
                'success' : '댓글이 작성되었습니다.'
            }
            return Response(messages, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

class CommentUpdateDelete(APIView):
    '''스터디 댓글 수정&삭제'''
    permission_classes = [IsTokenValid]  

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

        serializer = CommentSerializer(comment, data=request.data, partial=True) # partial = True -> 부분적으로 수정가능하도록!)

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
        messages = {
            'success' : '댓글이 정상적으로 삭제되었습니다.'
        }
        return Response(messages, status=status.HTTP_204_NO_CONTENT)
    


class ToggleLike(APIView):
    '''스터디 좋아요'''
    permission_classes = [IsTokenValid] 

    def post(self, request, study_id):
        study = get_object_or_404(Study, pk=study_id)

        user = get_user_from_token(request)
        
        try:
            like = Like.objects.get(user=user, study=study)
            if like.liked:
                like.delete()
                study.likes.remove(user)
                messages = {
                    'cancel' : f'{study.author} 게시물 좋아요를 취소했습니다.' 
                }
                return Response(messages, status=status.HTTP_204_NO_CONTENT)
            else:
                like.liked = True
                like.save()
                study.likes.add(user)
                messages = {
                    'success' : f'{study.author} 게시물 좋아요를 눌렀습니다.' 
                }
                return Response(messages, status=status.HTTP_201_CREATED)
            
        except Like.DoesNotExist:
            like = Like(user=user, study=study, liked=True)
            like.save()
            study.likes.add(user)
            serializer = LikeSerializer(like)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
