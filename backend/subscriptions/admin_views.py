"""
Admin views for the subscription system.
Handles payment verification, analytics, and user management.
"""

from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db.models import Count, Sum, Q
from django.conf import settings
from datetime import timedelta

from users.models import User
from users.serializers import UserSerializer
from .models import PaymentRequest, Subscription, ExportLog
from .serializers import PaymentRequestListSerializer
from .permissions import IsAdminUser
from .throttles import AdminActionThrottle


class AdminLoginView(APIView):
    """
    POST /api/admin-portal/login/
    Admin-specific login that verifies staff status.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(email=email, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff:
            return Response(
                {'error': 'Admin access denied.'},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Admin login successful.',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'is_staff': user.is_staff,
            },
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)


class PaymentListView(generics.ListAPIView):
    """
    GET /api/admin-portal/payments/
    List all payment requests with optional status filter.
    Query params: ?status=pending|approved|rejected&search=email
    """
    serializer_class = PaymentRequestListSerializer
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    def get_queryset(self):
        qs = PaymentRequest.objects.select_related('user', 'reviewed_by')
        status_filter = self.request.query_params.get('status')
        search = self.request.query_params.get('search', '').strip()

        if status_filter in ('pending', 'approved', 'rejected'):
            qs = qs.filter(status=status_filter)

        if search:
            qs = qs.filter(
                Q(user__email__icontains=search) |
                Q(user__name__icontains=search) |
                Q(transaction_id__icontains=search)
            )

        return qs


class ApprovePaymentView(APIView):
    """
    POST /api/admin-portal/payments/<id>/approve/
    Approve a payment and activate premium subscription.
    """
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    def post(self, request, payment_id):
        try:
            payment = PaymentRequest.objects.get(id=payment_id)
        except PaymentRequest.DoesNotExist:
            return Response(
                {'error': 'Payment request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment.status != 'pending':
            return Response(
                {'error': f'Payment is already {payment.status}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()
        duration = settings.PREMIUM_DURATION_DAYS

        # Check if user already has an active subscription — extend it
        existing_sub = Subscription.objects.filter(
            user=payment.user,
            is_active=True,
            end_date__gt=now
        ).order_by('-end_date').first()

        if existing_sub:
            start_date = existing_sub.end_date
        else:
            start_date = now

        end_date = start_date + timedelta(days=duration)

        # Update payment status
        payment.status = 'approved'
        payment.reviewed_at = now
        payment.reviewed_by = request.user
        payment.save()

        # Create subscription record
        Subscription.objects.create(
            user=payment.user,
            payment=payment,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
        )

        # Update user premium fields
        user = payment.user
        user.is_premium = True
        user.premium_start_date = start_date
        user.premium_end_date = end_date
        user.save(update_fields=['is_premium', 'premium_start_date', 'premium_end_date'])

        return Response({
            'message': f'Payment approved. Premium active until {end_date.strftime("%Y-%m-%d")}.',
            'subscription': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'days': duration,
            }
        }, status=status.HTTP_200_OK)


class RejectPaymentView(APIView):
    """
    POST /api/admin-portal/payments/<id>/reject/
    Reject a payment with a reason.
    """
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    def post(self, request, payment_id):
        try:
            payment = PaymentRequest.objects.get(id=payment_id)
        except PaymentRequest.DoesNotExist:
            return Response(
                {'error': 'Payment request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment.status != 'pending':
            return Response(
                {'error': f'Payment is already {payment.status}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', '').strip()
        if not reason:
            return Response(
                {'error': 'Rejection reason is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment.status = 'rejected'
        payment.rejection_reason = reason
        payment.reviewed_at = timezone.now()
        payment.reviewed_by = request.user
        payment.save()

        return Response({
            'message': 'Payment rejected.',
            'reason': reason,
        }, status=status.HTTP_200_OK)


class AnalyticsView(APIView):
    """
    GET /api/admin-portal/analytics/
    Returns dashboard analytics for the admin.
    """
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    def get(self, request):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        total_users = User.objects.count()
        premium_users = User.objects.filter(is_premium=True).count()
        pending_payments = PaymentRequest.objects.filter(status='pending').count()
        approved_payments = PaymentRequest.objects.filter(status='approved')
        total_revenue = approved_payments.aggregate(
            total=Sum('amount')
        )['total'] or 0

        monthly_revenue = approved_payments.filter(
            reviewed_at__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_exports = ExportLog.objects.count()
        monthly_exports = ExportLog.objects.filter(exported_at__gte=month_start).count()

        # Recent payments for quick view
        recent_payments = PaymentRequest.objects.select_related('user').order_by(
            '-submitted_at'
        )[:5]

        return Response({
            'total_users': total_users,
            'premium_users': premium_users,
            'pending_payments': pending_payments,
            'total_revenue': float(total_revenue),
            'monthly_revenue': float(monthly_revenue),
            'total_exports': total_exports,
            'monthly_exports': monthly_exports,
            'recent_payments': PaymentRequestListSerializer(
                recent_payments, many=True
            ).data,
        }, status=status.HTTP_200_OK)


class UserSearchView(generics.ListAPIView):
    """
    GET /api/admin-portal/users/?search=...
    Search and list users with their premium status.
    """
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    class UserAdminSerializer(UserSerializer):
        """Extended user serializer with premium fields for admin."""
        class Meta(UserSerializer.Meta):
            fields = UserSerializer.Meta.fields + [
                'is_premium', 'premium_start_date', 'premium_end_date',
                'phone', 'is_staff', 'is_active',
            ]
            read_only_fields = fields

    serializer_class = UserAdminSerializer

    def get_queryset(self):
        qs = User.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', '').strip()
        filter_type = self.request.query_params.get('filter')

        if search:
            qs = qs.filter(
                Q(email__icontains=search) |
                Q(name__icontains=search) |
                Q(username__icontains=search)
            )

        if filter_type == 'premium':
            qs = qs.filter(is_premium=True)
        elif filter_type == 'free':
            qs = qs.filter(is_premium=False)

        return qs


class ExtendSubscriptionView(APIView):
    """
    POST /api/admin-portal/users/<user_id>/extend/
    Manually extend a user's premium subscription.
    Body: { "days": 30 }
    """
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        days = request.data.get('days', 30)
        try:
            days = int(days)
            if days < 1 or days > 365:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'Days must be between 1 and 365.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()

        # If user already has active subscription, extend from end_date
        existing_sub = Subscription.objects.filter(
            user=user,
            is_active=True,
            end_date__gt=now
        ).order_by('-end_date').first()

        if existing_sub:
            start_date = existing_sub.end_date
        else:
            start_date = now

        end_date = start_date + timedelta(days=days)

        Subscription.objects.create(
            user=user,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
        )

        user.is_premium = True
        user.premium_start_date = start_date
        user.premium_end_date = end_date
        user.save(update_fields=['is_premium', 'premium_start_date', 'premium_end_date'])

        return Response({
            'message': f'Subscription extended by {days} days until {end_date.strftime("%Y-%m-%d")}.',
            'end_date': end_date.isoformat(),
        }, status=status.HTTP_200_OK)
