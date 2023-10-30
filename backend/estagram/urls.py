from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions

# swagger 문서를 위한 패키지
from drf_yasg.views import get_schema_view
from drf_yasg import openapi 

schema_view = get_schema_view(
    openapi.Info(
        title = 'Estagram API',
        default_version = 'v1.0',
        description = 'Estagram API 문서',
        terms_of_service = 'https://127.0.0.1/terms/',
        contact = openapi.Contact(email= "haminsu5@gmail.com"),
        license = openapi.License(name = 'MIT'), # MIT -> 모두가 쓸 수 있는
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('user.urls')), # user url
    path('api/story/', include('story.urls')), # story url
    path('api/study/', include('study.urls')), # study url
    path('api/alrarm/', include('alrarm.urls')), # alrarm url
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), # swagger url
]

# 임시 media url 설정
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)