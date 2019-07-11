from django.contrib import admin
from django.urls import path, re_path, include
from . import views


urlpatterns = [
    path('admin', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'', views.catchall, name='catchall'),
]
