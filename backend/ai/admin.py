"""Admin configuration for AI models."""

from django.contrib import admin
from .models import AISuggestion


@admin.register(AISuggestion)
class AISuggestionAdmin(admin.ModelAdmin):
    list_display = ['resume', 'suggestion_type', 'created_at']
    list_filter = ['suggestion_type', 'created_at']
    search_fields = ['resume__title', 'original_text']
    readonly_fields = ['created_at']
