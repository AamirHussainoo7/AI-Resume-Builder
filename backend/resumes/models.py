"""
Models for the Resume system.
Includes Resume, Experience, Education, and Project models
with proper foreign key relationships and cascade deletion.
"""

from django.db import models
from django.conf import settings


class Resume(models.Model):
    """
    Core resume model. Each user can have multiple resumes.
    Skills are stored as a JSON array for flexibility.
    """

    TEMPLATE_CHOICES = [
        ('modern', 'Modern'),
        ('classic', 'Classic'),
        ('minimal', 'Minimal'),
        ('executive', 'Executive ★'),
        ('creative', 'Creative ★'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    title = models.CharField(max_length=255, default='Untitled Resume')
    template_name = models.CharField(
        max_length=50,
        choices=TEMPLATE_CHOICES,
        default='modern'
    )
    # Personal info fields stored on the resume
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    linkedin = models.URLField(blank=True)
    website = models.URLField(blank=True)

    summary = models.TextField(blank=True, help_text='Professional summary')
    skills = models.JSONField(
        default=list,
        blank=True,
        help_text='List of skills as JSON array'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resumes'
        ordering = ['-updated_at']
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'

    def __str__(self):
        return f"{self.title} — {self.user.email}"


class Experience(models.Model):
    """Work experience entry for a resume."""

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='experiences'
    )
    company_name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True, help_text='Leave blank if current')
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0, help_text='Display order')

    class Meta:
        db_table = 'experiences'
        ordering = ['order', '-start_date']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'

    def __str__(self):
        return f"{self.role} at {self.company_name}"


class Education(models.Model):
    """Education entry for a resume."""

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='educations'
    )
    college_name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True)
    cgpa = models.CharField(max_length=10, blank=True)
    start_year = models.PositiveIntegerField(null=True, blank=True)
    end_year = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'educations'
        ordering = ['order', '-start_year']
        verbose_name = 'Education'
        verbose_name_plural = 'Educations'

    def __str__(self):
        return f"{self.degree} — {self.college_name}"


class Project(models.Model):
    """Project entry for a resume."""

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    project_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    tech_stack = models.JSONField(
        default=list,
        blank=True,
        help_text='Technologies used as JSON array'
    )
    github_link = models.URLField(blank=True)
    live_link = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'projects'
        ordering = ['order']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.project_name
