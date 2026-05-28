"""
Admin portal URL configuration for the subscriptions app.
"""

from django.urls import path
from .admin_views import (
    AdminLoginView,
    PaymentListView,
    ApprovePaymentView,
    RejectPaymentView,
    AnalyticsView,
    UserSearchView,
    ExtendSubscriptionView,
)

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('payments/', PaymentListView.as_view(), name='admin-payments'),
    path('payments/<int:payment_id>/approve/', ApprovePaymentView.as_view(), name='admin-approve'),
    path('payments/<int:payment_id>/reject/', RejectPaymentView.as_view(), name='admin-reject'),
    path('analytics/', AnalyticsView.as_view(), name='admin-analytics'),
    path('users/', UserSearchView.as_view(), name='admin-users'),
    path('users/<int:user_id>/extend/', ExtendSubscriptionView.as_view(), name='admin-extend'),
]
