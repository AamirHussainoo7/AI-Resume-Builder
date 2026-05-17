"""URL configuration for the PDF generator app."""

from django.urls import path
from .views import GeneratePDFView

urlpatterns = [
    path('generate/', GeneratePDFView.as_view(), name='pdf-generate'),
]
