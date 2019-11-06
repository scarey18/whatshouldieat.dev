import os
from .base import *


DEBUG = False

SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS += ['www.whatshouldieat.dev', os.environ.get('HOST', '')]

TEMPLATES[0]['DIRS'] += [os.path.join(BASE_DIR, 'frontend/build')]

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend/build/static/'),
]