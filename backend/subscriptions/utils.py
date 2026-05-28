"""
Utility functions for subscription management.
Provides helpers for checking subscription validity and export limits.
"""

from django.utils import timezone
from django.conf import settings


def check_subscription_valid(user):
    """
    Check if a user has an active, non-expired premium subscription.
    Returns (is_premium, subscription_or_none).
    """
    from .models import Subscription

    subscription = Subscription.objects.filter(
        user=user,
        is_active=True,
        end_date__gt=timezone.now()
    ).order_by('-end_date').first()

    if subscription:
        return True, subscription
    return False, None


def get_remaining_free_exports(user):
    """
    Count remaining free exports for the current month.
    Returns (remaining, used, limit).
    """
    from .models import ExportLog

    limit = getattr(settings, 'FREE_EXPORT_LIMIT', 3)
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    used = ExportLog.objects.filter(
        user=user,
        exported_at__gte=month_start,
        is_premium_export=False
    ).count()

    remaining = max(0, limit - used)
    return remaining, used, limit


def get_subscription_status(user):
    """
    Build a complete subscription status dict for a user.
    Admin/staff users always show as premium with unlimited access.
    Used by the status API endpoint.
    """
    # Admin users bypass subscription model entirely
    if user.is_staff:
        return {
            'is_premium': True,
            'is_admin': True,
            'free_exports_remaining': 999,
            'free_exports_used': 0,
            'free_exports_limit': 999,
            'plan': 'admin',
            'subscription_start': None,
            'subscription_end': None,
            'days_remaining': 999,
        }

    is_premium, subscription = check_subscription_valid(user)
    remaining, used, limit = get_remaining_free_exports(user)

    status = {
        'is_premium': is_premium,
        'is_admin': False,
        'free_exports_remaining': remaining,
        'free_exports_used': used,
        'free_exports_limit': limit,
        'plan': 'premium' if is_premium else 'free',
    }

    if subscription:
        status.update({
            'subscription_start': subscription.start_date.isoformat(),
            'subscription_end': subscription.end_date.isoformat(),
            'days_remaining': subscription.days_remaining,
        })
    else:
        status.update({
            'subscription_start': None,
            'subscription_end': None,
            'days_remaining': 0,
        })

    return status

