from django.contrib import admin
from .models import Study, Comment, Stack, Like

admin.site.register(Study)
admin.site.register(Comment)
admin.site.register(Stack)
admin.site.register(Like)
