from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import AccessToken

class IsTokenValid(BasePermission):
    def has_permission(self, request, view):
        try:
            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]  # JWT 토큰 추출
            access_token = AccessToken(token)
            user = access_token.payload.get('user_id')
            return user is not None
        except Exception as e:
            return False
