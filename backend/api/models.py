from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator


class Restaurant(models.Model):
	yelp_id = models.SlugField()


class User(AbstractUser):
	location = models.CharField(max_length=255)
	saved_restaurants = models.ManyToManyField(Restaurant)
	categories = models.TextField(blank=True)
	search_radius = models.IntegerField(
		null=True, blank=True,
		validators=[MaxValueValidator(40000), MinValueValidator(1)]
	)


class VisitedRestaurant(models.Model):
	restaurant = models.ForeignKey(
		Restaurant, related_name='visits', on_delete=models.CASCADE
	)
	User = models.ForeignKey(
		User, related_name='visits', on_delete=models.CASCADE
	)
	comments = models.TextField()