import requests
import os
from django.http import Http404, HttpResponse


def restaurants(request):
	location = request.GET['location']
	params = {
		'location': location,
		'open_now': True,
	}
	api_key = os.environ['YELP_API_KEY']
	response = requests.get(
		'https://api.yelp.com/v3/businesses/search', 
		params=params,
		headers={'Authorization': f'Bearer {api_key}'},
	)
	return HttpResponse(response.text, content_type="application/json")