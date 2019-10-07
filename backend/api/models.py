from django.db import models
from django.contrib.auth.models import AbstractUser
# from django.core.validators import MaxValueValidator, MinValueValidator


class FeedbackPost(models.Model):
	sender_name = models.CharField(max_length=255)
	text = models.TextField()
	sender_email = models.EmailField(blank=True)

	def __str__(self):
		return self.sender_name



# POTENTIAL FUTURE ADDITIONS

# class Restaurant(models.Model):
# 	yelp_id = models.SlugField()


class User(AbstractUser):
	pass
	# location = models.CharField(max_length=255)
	# saved_restaurants = models.ManyToManyField(Restaurant)
	# categories = models.TextField(blank=True)
	# search_radius = models.IntegerField(
	# 	null=True, blank=True,
	# 	validators=[MaxValueValidator(40000), MinValueValidator(1)]
	# )


# class VisitedRestaurant(models.Model):
# 	restaurant = models.ForeignKey(
# 		Restaurant, related_name='visits', on_delete=models.CASCADE
# 	)
# 	User = models.ForeignKey(
# 		User, related_name='visits', on_delete=models.CASCADE
# 	)
# 	comments = models.TextField()