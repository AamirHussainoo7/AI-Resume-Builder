#!/usr/bin/env bash
# Build script for Render deployment
# https://render.com/docs/deploy-django

set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate
