"""
Models for the subscription and payment system.
Handles payment requests, subscription tracking, and export logging.
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class PaymentRequest(models.Model):
    """
    Stores a user's payment submission for admin verification.
    Tracks transaction details, screenshot, and review status.
    """

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_requests'
    )
    transaction_id = models.CharField(
        max_length=100,
        help_text='UPI/Bank transaction reference ID'
    )
    screenshot = models.ImageField(
        upload_to='payment_screenshots/%Y/%m/',
        help_text='Payment confirmation screenshot'
    )
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=99.00,
        help_text='Amount paid in INR'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    rejection_reason = models.TextField(
        blank=True,
        help_text='Reason for rejection (if rejected)'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_payments'
    )

    class Meta:
        db_table = 'payment_requests'
        ordering = ['-submitted_at']
        verbose_name = 'Payment Request'
        verbose_name_plural = 'Payment Requests'

    def __str__(self):
        return f"Payment #{self.id} — {self.user.email} — {self.status}"


class Subscription(models.Model):
    """
    Tracks a user's premium subscription period.
    Each approved payment creates a new subscription record.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    payment = models.OneToOneField(
        PaymentRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subscription'
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subscriptions'
        ordering = ['-created_at']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'

    def __str__(self):
        return f"Sub #{self.id} — {self.user.email} — {'Active' if self.is_active else 'Expired'}"

    @property
    def is_valid(self):
        """Check if subscription is currently valid."""
        return self.is_active and self.end_date > timezone.now()

    @property
    def days_remaining(self):
        """Return days remaining in subscription."""
        if not self.is_valid:
            return 0
        delta = self.end_date - timezone.now()
        return max(0, delta.days)


class ExportLog(models.Model):
    """
    Tracks every PDF export for usage metering.
    Used to enforce free-tier export limits.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='export_logs'
    )
    resume_title = models.CharField(max_length=255)
    template_name = models.CharField(max_length=50)
    exported_at = models.DateTimeField(auto_now_add=True)
    is_premium_export = models.BooleanField(
        default=False,
        help_text='Was this export made with an active premium subscription'
    )

    class Meta:
        db_table = 'export_logs'
        ordering = ['-exported_at']
        verbose_name = 'Export Log'
        verbose_name_plural = 'Export Logs'

    def __str__(self):
        return f"Export — {self.user.email} — {self.resume_title}"
