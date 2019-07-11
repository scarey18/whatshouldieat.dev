from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, FeedbackPost


admin.site.register(FeedbackPost)
admin.site.register(User, UserAdmin)