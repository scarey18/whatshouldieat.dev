from django.urls import path

from . import views


app_name = 'api'

urlpatterns = [
	path('restaurants', views.restaurants, name='restaurants'),
	path('feedback', views.feedbackFormView, name='feedback'),
]