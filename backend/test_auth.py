import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from users.serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.backends import ModelBackend

# Clean slate
User.objects.filter(email='yuvraj@gmail.com').delete()

# Step 1: Register (exactly as the API would)
print("=== REGISTER ===")
reg_data = {
    'name': 'Yuvraj',
    'email': 'yuvraj@gmail.com',
    'username': 'yuvraj',
    'password': 'yuvraj@123',
    'password_confirm': 'yuvraj@123',
}
reg_serializer = RegisterSerializer(data=reg_data)
if reg_serializer.is_valid():
    user = reg_serializer.save()
    print(f"Registered: email={user.email}, username={user.username}")
    print(f"Password hash: {user.password[:50]}...")
    print(f"check_password('yuvraj@123'): {user.check_password('yuvraj@123')}")
else:
    print(f"Registration errors: {reg_serializer.errors}")
    exit()

# Step 2: Verify user in DB
print("\n=== DB CHECK ===")
db_user = User.objects.get(email='yuvraj@gmail.com')
print(f"DB user: email={db_user.email}, username={db_user.username}")
print(f"DB check_password('yuvraj@123'): {db_user.check_password('yuvraj@123')}")

# Step 3: Test authenticate directly
print("\n=== AUTHENTICATE DIRECT ===")
auth_result = authenticate(email='yuvraj@gmail.com', password='yuvraj@123')
print(f"authenticate(email=..., password=...): {auth_result}")

# Step 4: Test via LoginSerializer (exactly as the API would)
print("\n=== LOGIN SERIALIZER ===")
login_data = {'email': 'yuvraj@gmail.com', 'password': 'yuvraj@123'}
login_serializer = LoginSerializer(data=login_data)
try:
    login_serializer.is_valid(raise_exception=True)
    print(f"Login SUCCESS: user={login_serializer.validated_data['user']}")
except Exception as e:
    print(f"Login FAILED: {e}")

# Step 5: Check what auth backends are configured
print("\n=== AUTH BACKENDS ===")
from django.conf import settings
backends = getattr(settings, 'AUTHENTICATION_BACKENDS', ['django.contrib.auth.backends.ModelBackend'])
print(f"Backends: {backends}")

# Cleanup
User.objects.filter(email='yuvraj@gmail.com').delete()
print("\nCleaned up.")
