import os
from .base import *


DEBUG = False

SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS += ['www.whatshouldieat.dev']

TEMPLATES[0]['DIRS'] += [os.path.join(BASE_DIR, 'frontend/build')]

SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 3600