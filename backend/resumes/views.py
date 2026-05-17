"""
Views for Resume CRUD operations.
All views are scoped to the authenticated user's resumes only.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeListSerializer, ResumeDetailSerializer


class ResumeListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/resumes/       — List all resumes for the authenticated user.
    POST /api/resumes/       — Create a new resume.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ResumeDetailSerializer
        return ResumeListSerializer

    def get_queryset(self):
        """Return only resumes belonging to the authenticated user."""
        return Resume.objects.filter(user=self.request.user).prefetch_related(
            'experiences', 'educations', 'projects'
        )

    def perform_create(self, serializer):
        """Automatically assign the authenticated user to the resume."""
        serializer.save(user=self.request.user)


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/resumes/:id/ — Retrieve a specific resume with all nested data.
    PUT    /api/resumes/:id/ — Update a resume (full update).
    PATCH  /api/resumes/:id/ — Partially update a resume.
    DELETE /api/resumes/:id/ — Delete a resume.
    """
    serializer_class = ResumeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Scope to the authenticated user's resumes only."""
        return Resume.objects.filter(user=self.request.user).prefetch_related(
            'experiences', 'educations', 'projects'
        )

    def destroy(self, request, *args, **kwargs):
        """Custom delete response with confirmation message."""
        instance = self.get_object()
        title = instance.title
        self.perform_destroy(instance)
        return Response(
            {'message': f'Resume "{title}" deleted successfully.'},
            status=status.HTTP_200_OK
        )
