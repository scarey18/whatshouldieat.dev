from django.urls import path

from . import views


app_name = 'api'

urlpatterns = [
	path('location', views.location, name='location'),
]