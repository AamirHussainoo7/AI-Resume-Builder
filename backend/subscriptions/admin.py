"""
Django admin configuration for the subscriptions app.
"""

from django.contrib import admin
from .models import PaymentRequest, Subscription, ExportLog


@admin.register(PaymentRequest)
class PaymentRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'transaction_id', 'amount', 'status', 'submitted_at', 'reviewed_at']
    list_filter = ['status', 'submitted_at']
    search_fields = ['user__email', 'transaction_id']
    readonly_fields = ['submitted_at']
    ordering = ['-submitted_at']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'start_date', 'end_date', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['user__email']
    ordering = ['-created_at']


@admin.register(ExportLog)
class ExportLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'resume_title', 'template_name', 'exported_at', 'is_premium_export']
    list_filter = ['template_name', 'is_premium_export']
    search_fields = ['user__email', 'resume_title']
    ordering = ['-exported_at']
