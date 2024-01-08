from django.contrib import admin
from .models import Study, Comment, Stack, Like, Team, TeamMember

admin.site.register(Study)
admin.site.register(Comment)
admin.site.register(Stack)
admin.site.register(Like)
admin.site.register(Team)
admin.site.register(TeamMember)
