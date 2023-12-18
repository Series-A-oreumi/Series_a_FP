# Generated by Django 4.2.6 on 2023-11-14 09:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("study", "0001_initial"),
        ("story", "0001_initial"),
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Noti_Comment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("content", models.CharField(max_length=300)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Notifications",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("category_article", models.CharField(max_length=255)),
                ("article_num", models.IntegerField()),
                ("category_likecomment", models.CharField(max_length=255)),
                ("content", models.CharField(max_length=300)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="user.userprofile",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Noti_Study",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "comments",
                    models.ManyToManyField(
                        related_name="study_comments", to="study.comment"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Noti_Story",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "comments",
                    models.ManyToManyField(
                        related_name="story_comments", to="story.comment"
                    ),
                ),
            ],
        ),
    ]
