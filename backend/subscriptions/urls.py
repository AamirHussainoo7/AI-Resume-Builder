"""
User-facing URL configuration for the subscriptions app.
"""

from django.urls import path
from .views import (
    SubmitPaymentView,
    SubscriptionStatusView,
    PaymentHistoryView,
    ExportHistoryView,
    PaymentConfigView,
)

urlpatterns = [
    path('config/', PaymentConfigView.as_view(), name='payment-config'),
    path('status/', SubscriptionStatusView.as_view(), name='subscription-status'),
    path('submit-payment/', SubmitPaymentView.as_view(), name='submit-payment'),
    path('payment-history/', PaymentHistoryView.as_view(), name='payment-history'),
    path('export-history/', ExportHistoryView.as_view(), name='export-history'),
]
