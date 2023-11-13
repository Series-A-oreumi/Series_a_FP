from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile 
from pathlib import Path

import json, os, uuid, boto3

BASE_DIR = Path(__file__).resolve().parent.parent
PASSWORD_FILE = os.path.join(BASE_DIR, "secret.json")
secrets = json.load(open(PASSWORD_FILE))


class S3ImgUploader:
    def __init__(self, file):
        self.file = file

    def upload(self):
        s3_client = boto3.client(
            "s3",
            aws_access_key_id = secrets["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key = secrets["AWS_SECRET_ACCESS_KEY"]
        )
        url = "img" + "/" + uuid.uuid1().hex

        s3_client.upload_fileobj(
            self.file, secrets['S3_NAME'], url, ExtraArgs={"ContentType": self.file.content_type}
        )
        return url


def get_user_from_token(request):

    # JWT 토큰에서 사용자 정보 디코드
    token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]  # JWT 토큰 추출
    access_token = AccessToken(token)
    user_id = access_token.payload['user_id']

    # 사용자 정보 가져오기
    try:
        user = UserProfile.objects.get(id=user_id)
        return user
    except UserProfile.DoesNotExist:
        return Response({'detail': '사용자를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)