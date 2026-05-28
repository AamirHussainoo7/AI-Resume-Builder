"""
Custom permissions for the subscription system.
"""

from rest_framework.permissions import BasePermission


class IsPremiumUser(BasePermission):
    """Allow access only to users with an active premium subscription."""

    message = 'Premium subscription required. Please upgrade your plan.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        from .utils import check_subscription_valid
        is_premium, _ = check_subscription_valid(request.user)
        return is_premium


class IsAdminUser(BasePermission):
    """Allow access only to admin/staff users."""

    message = 'Admin access required.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )
