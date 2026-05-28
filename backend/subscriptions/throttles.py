"""
Custom throttle classes for rate-limiting sensitive endpoints.
"""

from rest_framework.throttling import UserRateThrottle


class PaymentSubmitThrottle(UserRateThrottle):
    """Limit payment submissions to prevent abuse."""
    scope = 'payment'


class AdminActionThrottle(UserRateThrottle):
    """Higher rate limit for admin operations."""
    scope = 'admin'
