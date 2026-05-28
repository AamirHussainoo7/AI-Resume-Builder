"""
Views for user-facing subscription endpoints.
Handles payment submission, status checks, and export history.
"""

from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings

from .models import PaymentRequest, ExportLog
from .serializers import (
    PaymentSubmitSerializer,
    PaymentHistorySerializer,
    ExportLogSerializer,
)
from .utils import get_subscription_status
from .throttles import PaymentSubmitThrottle


class SubmitPaymentView(APIView):
    """
    POST /api/subscriptions/submit-payment/
    Submit a payment proof for admin verification.
    Requires: transaction_id, screenshot (file upload).
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [PaymentSubmitThrottle]

    def post(self, request):
        # Check if user already has a pending request
        pending = PaymentRequest.objects.filter(
            user=request.user,
            status='pending'
        ).exists()

        if pending:
            return Response(
                {'error': 'You already have a pending payment request. Please wait for verification.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PaymentSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, amount=settings.PREMIUM_PRICE_INR)

        return Response({
            'message': 'Payment submitted successfully. You will be notified once verified.',
            'payment': serializer.data,
        }, status=status.HTTP_201_CREATED)


class SubscriptionStatusView(APIView):
    """
    GET /api/subscriptions/status/
    Returns the user's current subscription status.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        status_data = get_subscription_status(request.user)
        return Response(status_data, status=status.HTTP_200_OK)


class PaymentHistoryView(generics.ListAPIView):
    """
    GET /api/subscriptions/payment-history/
    Returns the user's own payment request history.
    """
    serializer_class = PaymentHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentRequest.objects.filter(user=self.request.user)


class ExportHistoryView(generics.ListAPIView):
    """
    GET /api/subscriptions/export-history/
    Returns the user's PDF export history.
    """
    serializer_class = ExportLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExportLog.objects.filter(user=self.request.user)[:50]


class PaymentConfigView(APIView):
    """
    GET /api/subscriptions/config/
    Returns UPI payment configuration for the frontend.
    Public endpoint (no auth required to view pricing).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'upi_id': settings.UPI_ID,
            'price': float(settings.PREMIUM_PRICE_INR),
            'currency': 'INR',
            'duration_days': settings.PREMIUM_DURATION_DAYS,
            'free_export_limit': settings.FREE_EXPORT_LIMIT,
            'plan_name': 'Premium',
        }, status=status.HTTP_200_OK)
