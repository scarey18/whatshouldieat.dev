import requests
import os
from django import http
from django.conf import settings
from django.template import engines
from django.shortcuts import render


def dev(request, upstream=f'http://{os.environ.get("NETWORK_IP", "")}:9000'):
	upstream_url = upstream + request.path
	response = requests.get(upstream_url, stream=True)
	content_type = response.headers.get('Content-Type')
	
	if content_type == 'text/html; charset=UTF-8':
		content = engines['django'].from_string(response.text).render()
		context = {
			'content': content,
			'test': 'Hello World!',
		}
		return render(request, 'development.html', context)
	else:
		return http.StreamingHttpResponse(
			streaming_content=response.iter_content(2 ** 12),
			content_type=content_type,
			status=response.status_code,
			reason=response.reason,
		)


catchall = dev if settings.DEBUG else 'future production view'