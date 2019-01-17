from .base import *


DEBUG = True

SECRET_KEY = 'p5%(4#!&co^6d(0%129guh&yo2cncw-@=nc1y2+%(ue(dn0my0'

ALLOWED_HOSTS += [os.environ.get('NETWORK_IP', '')]

TEMPLATES[0]['DIRS'] += [os.path.join(BASE_DIR, 'frontend/public')]

WSGI_APPLICATION = 'backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'backend/db.sqlite3'),
    }
}