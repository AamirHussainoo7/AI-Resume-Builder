"""
Root URL configuration for AI Resume Builder.
Routes all API endpoints to their respective apps.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    """Quick health-check that also reports the active DB engine."""
    db_engine = settings.DATABASES['default']['ENGINE']
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Read git commit if available
    import subprocess
    try:
        commit = subprocess.check_output(
            ['git', 'rev-parse', '--short', 'HEAD'],
            stderr=subprocess.DEVNULL
        ).decode().strip()
    except Exception:
        commit = 'unknown'

    return JsonResponse({
        'status': 'ok',
        'version': commit,
        'database_engine': db_engine,
        'user_count': User.objects.count(),
    })


urlpatterns = [
    # Health check (public, no auth required)
    path('api/health/', health_check, name='health-check'),

    # Admin panel
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/auth/', include('users.urls')),
    path('api/resumes/', include('resumes.urls')),
    path('api/ai/', include('ai.urls')),
    path('api/pdf/', include('pdf_generator.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/admin-portal/', include('subscriptions.admin_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

