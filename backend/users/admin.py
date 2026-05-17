"""Admin configuration for User model."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for the extended User model."""

    list_display = ['email', 'name', 'username', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'name', 'username']
    ordering = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('name', 'profile_image')}),
    )
