"""
ASGI config for tripmate. Used by async servers (e.g. Daphne).
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tripmate.settings")
application = get_asgi_application()
