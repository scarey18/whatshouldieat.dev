import requests
import os
from django.http import HttpResponse
from django.core.cache import cache


def restaurants(request):
	full_path = request.get_full_path()
	data = cache.get(full_path)
	if data is None:
		params = {
			'location': request.GET['location'],
			'categories': request.GET['categories'],
			'limit': 50,
			'offset': request.GET['offset'],
			'sort_by': 'distance',
			'open_now': True,
		}
		if request.GET.get('price', '') != '':
			params['price'] = request.GET['price']
		api_key = os.environ['YELP_API_KEY']
		response = requests.get(
			'https://api.yelp.com/v3/businesses/search', 
			params=params,
			headers={'Authorization': f'Bearer {api_key}'},
		)
		data = response.text
		cache.set(full_path, data, 60 * 15)
	return HttpResponse(data, content_type="application/json")