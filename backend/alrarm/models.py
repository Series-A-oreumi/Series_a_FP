from django.db import models


# Create your models here.
class Notification(models.Model):
    study = models.ForeignKey("study.Study", on_delete=models.CASCADE, related_name="notification", null=False)
    User = models.ForeignKey("user.UserProfile", on_delete=models.CASCADE, related_name="notification", null=True)
    content = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
