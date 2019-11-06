from .base import *


DEBUG = True

SECRET_KEY = 'p5%(4#!&co^6d(0%129guh&yo2cncw-@=nc1y2+%(ue(dn0my0'

ALLOWED_HOSTS += [os.environ.get('HOST', '')]

TEMPLATES[0]['DIRS'] += [os.path.join(BASE_DIR, 'frontend/public')]