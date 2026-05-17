"""Admin configuration for Resume models."""

from django.contrib import admin
from .models import Resume, Experience, Education, Project


class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 0


class EducationInline(admin.TabularInline):
    model = Education
    extra = 0


class ProjectInline(admin.TabularInline):
    model = Project
    extra = 0


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'template_name', 'updated_at', 'created_at']
    list_filter = ['template_name', 'created_at']
    search_fields = ['title', 'user__email', 'full_name']
    inlines = [ExperienceInline, EducationInline, ProjectInline]
    readonly_fields = ['created_at', 'updated_at']
