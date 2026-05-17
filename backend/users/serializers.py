"""
Serializers for user authentication and profile management.
Handles registration, login, and profile data serialization.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration with password validation."""

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'username', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {'required': True},
            'name': {'required': True},
        }

    def validate_email(self, value):
        """Ensure email is unique (case-insensitive)."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return attrs

    def create(self, validated_data):
        """Create a new user with hashed password."""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            password=validated_data['password'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login — validates credentials."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        """Authenticate user with email and password."""
        email = attrs.get('email', '').lower()
        password = attrs.get('password', '')

        if not email or not password:
            raise serializers.ValidationError('Both email and password are required.')

        # Find user by email, authenticate with username
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')

        user = authenticate(username=user.username, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data (read/update)."""

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'username', 'profile_image', 'created_at']
        read_only_fields = ['id', 'email', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password]
    )

    def validate_old_password(self, value):
        """Verify the old password is correct."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value
