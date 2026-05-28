"""
Views for PDF generation with export tracking and free-tier limits.
"""

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from resumes.models import Resume
from resumes.serializers import ResumeDetailSerializer
from .services import PDFService, WEASYPRINT_AVAILABLE
from subscriptions.utils import check_subscription_valid, get_remaining_free_exports
from subscriptions.models import ExportLog


# Premium-only templates
PREMIUM_TEMPLATES = {'executive', 'creative'}


class GeneratePDFView(APIView):
    """
    POST /api/pdf/generate
    Generate a PDF from a resume.
    Tracks exports and enforces free-tier limits.

    Request body:
        - resume_id (int): ID of the resume to generate PDF for
        - template_name (str, optional): Template to use (modern/classic/minimal/executive/creative)
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        template_name = request.data.get('template_name', 'modern')

        if not resume_id:
            return Response(
                {'error': 'resume_id is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            resume = Resume.objects.prefetch_related(
                'experiences', 'educations', 'projects'
            ).get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response(
                {'error': 'Resume not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Admin/staff users bypass all subscription checks
        is_admin = request.user.is_staff
        is_premium, _ = check_subscription_valid(request.user)

        if not is_admin:
            # Check premium for premium-only templates
            if template_name in PREMIUM_TEMPLATES and not is_premium:
                return Response(
                    {'error': 'This template requires a Premium subscription. Please upgrade.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check free-tier export limit for non-premium users
            if not is_premium:
                remaining, used, limit = get_remaining_free_exports(request.user)
                if remaining <= 0:
                    return Response({
                        'error': 'Free export limit reached. Please upgrade to Premium for unlimited exports.',
                        'exports_used': used,
                        'exports_limit': limit,
                    }, status=status.HTTP_403_FORBIDDEN)

        # Serialize resume data
        resume_data = ResumeDetailSerializer(resume).data

        # Generate PDF
        try:
            pdf_bytes = PDFService.generate_pdf(resume_data, template_name)

            if WEASYPRINT_AVAILABLE:
                content_type = 'application/pdf'
                filename = f"{resume.title.replace(' ', '_')}.pdf"
            else:
                content_type = 'text/html'
                filename = f"{resume.title.replace(' ', '_')}.html"

            # Log the export
            ExportLog.objects.create(
                user=request.user,
                resume_title=resume.title,
                template_name=template_name,
                is_premium_export=is_premium or is_admin,
            )

            response = HttpResponse(pdf_bytes, content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response

        except Exception as e:
            return Response(
                {'error': f'PDF generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
