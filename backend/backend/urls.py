"""
Root URL configuration for AI Resume Builder.
Routes all API endpoints to their respective apps.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/auth/', include('users.urls')),
    path('api/resumes/', include('resumes.urls')),
    path('api/ai/', include('ai.urls')),
    path('api/pdf/', include('pdf_generator.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
