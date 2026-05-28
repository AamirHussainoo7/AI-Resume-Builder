"""
Serializers for the subscription and payment system.
"""

from rest_framework import serializers
from .models import PaymentRequest, Subscription, ExportLog


class PaymentSubmitSerializer(serializers.ModelSerializer):
    """Serializer for submitting a payment request."""

    class Meta:
        model = PaymentRequest
        fields = ['id', 'transaction_id', 'screenshot', 'amount', 'submitted_at']
        read_only_fields = ['id', 'amount', 'submitted_at']

    def validate_transaction_id(self, value):
        """Ensure transaction ID is not already submitted."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Transaction ID is required.')
        if PaymentRequest.objects.filter(transaction_id=value).exists():
            raise serializers.ValidationError(
                'This transaction ID has already been submitted.'
            )
        return value


class PaymentRequestListSerializer(serializers.ModelSerializer):
    """Serializer for listing payment requests (admin view)."""

    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    reviewed_by_email = serializers.SerializerMethodField()

    class Meta:
        model = PaymentRequest
        fields = [
            'id', 'user', 'user_email', 'user_name', 'user_phone',
            'transaction_id', 'screenshot', 'amount', 'status',
            'rejection_reason', 'submitted_at', 'reviewed_at',
            'reviewed_by', 'reviewed_by_email',
        ]
        read_only_fields = fields

    def get_reviewed_by_email(self, obj):
        return obj.reviewed_by.email if obj.reviewed_by else None


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscription details."""

    days_remaining = serializers.IntegerField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id', 'start_date', 'end_date', 'is_active',
            'days_remaining', 'is_valid', 'created_at',
        ]
        read_only_fields = fields


class ExportLogSerializer(serializers.ModelSerializer):
    """Serializer for export history entries."""

    class Meta:
        model = ExportLog
        fields = [
            'id', 'resume_title', 'template_name',
            'exported_at', 'is_premium_export',
        ]
        read_only_fields = fields


class PaymentHistorySerializer(serializers.ModelSerializer):
    """Lightweight serializer for user's own payment history."""

    class Meta:
        model = PaymentRequest
        fields = [
            'id', 'transaction_id', 'amount', 'status',
            'rejection_reason', 'submitted_at', 'reviewed_at',
        ]
        read_only_fields = fields
