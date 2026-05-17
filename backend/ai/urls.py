"""URL configuration for the AI services app."""

from django.urls import path
from .views import ImproveTextView, ATSScoreView, GenerateSummaryView

urlpatterns = [
    path('improve/', ImproveTextView.as_view(), name='ai-improve'),
    path('ats-score/', ATSScoreView.as_view(), name='ai-ats-score'),
    path('generate-summary/', GenerateSummaryView.as_view(), name='ai-generate-summary'),
]
