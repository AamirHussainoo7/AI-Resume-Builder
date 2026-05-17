"""
Serializers for Resume CRUD operations.
Supports nested creation and updates for experiences, education, and projects.
"""

from rest_framework import serializers
from .models import Resume, Experience, Education, Project


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for work experience entries."""

    start_date = serializers.DateField(required=False, allow_null=True, default=None)
    end_date = serializers.DateField(required=False, allow_null=True, default=None)

    class Meta:
        model = Experience
        fields = [
            'id', 'company_name', 'role', 'description',
            'start_date', 'end_date', 'is_current', 'order'
        ]
        read_only_fields = ['id']

    def to_internal_value(self, data):
        """Convert empty strings to None for date fields."""
        for field in ('start_date', 'end_date'):
            if field in data and data[field] == '':
                data[field] = None
        return super().to_internal_value(data)


class EducationSerializer(serializers.ModelSerializer):
    """Serializer for education entries."""

    start_year = serializers.IntegerField(required=False, allow_null=True, default=None)
    end_year = serializers.IntegerField(required=False, allow_null=True, default=None)

    class Meta:
        model = Education
        fields = [
            'id', 'college_name', 'degree', 'field_of_study',
            'cgpa', 'start_year', 'end_year', 'order'
        ]
        read_only_fields = ['id']

    def to_internal_value(self, data):
        """Convert empty strings to None for integer year fields."""
        for field in ('start_year', 'end_year'):
            if field in data and data[field] == '':
                data[field] = None
        return super().to_internal_value(data)


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for project entries."""

    class Meta:
        model = Project
        fields = [
            'id', 'project_name', 'description', 'tech_stack',
            'github_link', 'live_link', 'order'
        ]
        read_only_fields = ['id']


class ResumeListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing resumes on the dashboard.
    Includes counts of related items for quick stats.
    """

    experience_count = serializers.IntegerField(
        source='experiences.count', read_only=True
    )
    education_count = serializers.IntegerField(
        source='educations.count', read_only=True
    )
    project_count = serializers.IntegerField(
        source='projects.count', read_only=True
    )

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'template_name', 'full_name',
            'created_at', 'updated_at',
            'experience_count', 'education_count', 'project_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResumeDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for resume detail view.
    Handles nested creation and updates of experiences, education, and projects.
    """

    experiences = ExperienceSerializer(many=True, required=False, default=[])
    educations = EducationSerializer(many=True, required=False, default=[])
    projects = ProjectSerializer(many=True, required=False, default=[])

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'template_name',
            'full_name', 'email', 'phone', 'location', 'linkedin', 'website',
            'summary', 'skills',
            'experiences', 'educations', 'projects',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create a resume with nested experiences, education, and projects."""
        experiences_data = validated_data.pop('experiences', [])
        educations_data = validated_data.pop('educations', [])
        projects_data = validated_data.pop('projects', [])

        resume = Resume.objects.create(**validated_data)

        # Create nested objects
        for exp_data in experiences_data:
            Experience.objects.create(resume=resume, **exp_data)
        for edu_data in educations_data:
            Education.objects.create(resume=resume, **edu_data)
        for proj_data in projects_data:
            Project.objects.create(resume=resume, **proj_data)

        return resume

    def update(self, instance, validated_data):
        """
        Update resume with nested data.
        Strategy: delete existing nested objects and recreate them.
        This simplifies handling of additions, removals, and reorders.
        """
        experiences_data = validated_data.pop('experiences', None)
        educations_data = validated_data.pop('educations', None)
        projects_data = validated_data.pop('projects', None)

        # Update resume fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Rebuild nested objects if provided
        if experiences_data is not None:
            instance.experiences.all().delete()
            for exp_data in experiences_data:
                Experience.objects.create(resume=instance, **exp_data)

        if educations_data is not None:
            instance.educations.all().delete()
            for edu_data in educations_data:
                Education.objects.create(resume=instance, **edu_data)

        if projects_data is not None:
            instance.projects.all().delete()
            for proj_data in projects_data:
                Project.objects.create(resume=instance, **proj_data)

        return instance
