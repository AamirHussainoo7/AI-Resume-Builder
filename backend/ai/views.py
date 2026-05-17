"""
Views for AI-powered resume features.
Handles text improvement, ATS scoring, and summary generation.
"""

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .services import AIService
from .models import AISuggestion
from resumes.models import Resume


class ImproveTextView(APIView):
    """
    POST /api/ai/improve
    Improve a resume text snippet using AI.

    Request body:
        - text (str): The text to improve
        - context (str, optional): Additional context (e.g., "work experience", "project description")
        - resume_id (int, optional): Resume ID to save the suggestion
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        text = request.data.get('text', '').strip()
        context = request.data.get('context', '')
        resume_id = request.data.get('resume_id')

        if not text:
            return Response(
                {'error': 'Text is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = AIService.improve_text(text, context)

        # Save suggestion if resume_id provided
        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                AISuggestion.objects.create(
                    resume=resume,
                    original_text=text,
                    improved_text=result.get('improved', ''),
                    suggestion_type='improve',
                )
            except Resume.DoesNotExist:
                pass  # Silently skip saving if resume not found

        return Response(result, status=status.HTTP_200_OK)


class ATSScoreView(APIView):
    """
    POST /api/ai/ats-score
    Analyze resume for ATS compatibility and return a score.

    Request body:
        - resume_id (int): ID of the resume to analyze
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')

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

        # Build resume data dict for analysis
        from resumes.serializers import ResumeDetailSerializer
        resume_data = ResumeDetailSerializer(resume).data

        result = AIService.get_ats_score(resume_data)

        # Save analysis
        AISuggestion.objects.create(
            resume=resume,
            original_text=f"ATS Analysis for: {resume.title}",
            improved_text=str(result),
            suggestion_type='ats',
        )

        return Response(result, status=status.HTTP_200_OK)


class GenerateSummaryView(APIView):
    """
    POST /api/ai/generate-summary
    Generate a professional summary based on resume data.

    Request body:
        - resume_id (int): ID of the resume to generate summary for
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')

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

        from resumes.serializers import ResumeDetailSerializer
        resume_data = ResumeDetailSerializer(resume).data

        result = AIService.generate_summary(resume_data)

        # Save suggestion
        AISuggestion.objects.create(
            resume=resume,
            original_text=f"Summary generation for: {resume.title}",
            improved_text=result.get('summary', ''),
            suggestion_type='summary',
        )

        return Response(result, status=status.HTTP_200_OK)
