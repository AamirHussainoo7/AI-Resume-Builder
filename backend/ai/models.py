"""
Model for storing AI suggestions and improvements.
"""

from django.db import models
from resumes.models import Resume


class AISuggestion(models.Model):
    """Stores AI-generated improvements for resume content."""

    SUGGESTION_TYPES = [
        ('improve', 'Text Improvement'),
        ('ats', 'ATS Analysis'),
        ('summary', 'Summary Generation'),
        ('skills', 'Skill Recommendation'),
    ]

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='ai_suggestions'
    )
    original_text = models.TextField()
    improved_text = models.TextField()
    suggestion_type = models.CharField(
        max_length=20,
        choices=SUGGESTION_TYPES,
        default='improve'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_suggestions'
        ordering = ['-created_at']
        verbose_name = 'AI Suggestion'
        verbose_name_plural = 'AI Suggestions'

    def __str__(self):
        return f"{self.suggestion_type} for Resume #{self.resume_id}"
