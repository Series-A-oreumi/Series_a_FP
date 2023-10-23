from django.contrib import admin
from .models import Post, Comment, Hashtag, PostImage, Like

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(PostImage)
admin.site.register(Hashtag)
admin.site.register(Like)
