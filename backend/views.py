import requests
import os
from django.http import StreamingHttpResponse
from django.conf import settings
from django.template import engines
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


# Streams content from the React development server
@ensure_csrf_cookie
def development(request, upstream=f'http://{os.environ.get("HOST", "")}:9000'):
	upstream_url = upstream + request.path
	response = requests.get(upstream_url, stream=True)
	content_type = response.headers.get('Content-Type')
	
	if content_type == 'text/html; charset=UTF-8':
		content = engines['django'].from_string(response.text).render()
		context = {
			'content': content,
		}
		return render(request, 'development.html', context)
	else:
		return StreamingHttpResponse(
			streaming_content=response.iter_content(2 ** 12),
			content_type=content_type,
			status=response.status_code,
			reason=response.reason,
		)


@ensure_csrf_cookie
def production(request):
	return render(request, 'index.html')


catchall = development if settings.DEBUG else production