import requests
import os
from django.http import HttpResponse
from django.core.cache import cache

from .forms import FeedbackPostForm


def restaurants(request):
	full_path = request.get_full_path()
	data = cache.get(full_path)
	if data is None:
		params = {
			'location': request.GET['location'],
			'categories': request.GET.get('categories', 'restaurants'),
			'limit': 50,
			'open_now': True,
		}

		priceParam = request.GET.get('price', None)
		if priceParam:
			params['price'] = priceParam

		offsetParam = request.GET.get('offset', None)
		if offsetParam:
			params['offset'] = offsetParam

		api_key = os.environ['YELP_API_KEY']
		response = requests.get(
			'https://api.yelp.com/v3/businesses/search', 
			params=params,
			headers={'Authorization': f'Bearer {api_key}'},
		)

		if response.status_code != 200:
			return HttpResponse(status=response.status_code)

		data = response.text
		cache.set(full_path, data, 60 * 15)
	return HttpResponse(data, content_type="application/json")


def feedbackFormView(request):
	form = FeedbackPostForm(request.POST)
	if form.is_valid():
		form.save()
	return HttpResponse(status=204)