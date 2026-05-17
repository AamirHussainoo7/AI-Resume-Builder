"""
Views for PDF generation.
"""

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from resumes.models import Resume
from resumes.serializers import ResumeDetailSerializer
from .services import PDFService, WEASYPRINT_AVAILABLE


class GeneratePDFView(APIView):
    """
    POST /api/pdf/generate
    Generate a PDF from a resume.

    Request body:
        - resume_id (int): ID of the resume to generate PDF for
        - template_name (str, optional): Template to use (modern/classic/minimal)
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

            response = HttpResponse(pdf_bytes, content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response

        except Exception as e:
            return Response(
                {'error': f'PDF generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
