from django.urls import path
from . import views
from django.conf.urls import include
from .views import *

urlpatterns = [
    path('', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('home/', views.home, name='home')
]