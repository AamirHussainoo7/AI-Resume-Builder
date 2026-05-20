import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from django.contrib.auth import authenticate

# Check all users in DB
print("=== ALL USERS ===")
for u in User.objects.all():
    pw_ok = u.has_usable_password()
    print(f"  id={u.id}, email={u.email}, username={u.username}, usable_pw={pw_ok}")

# Test: create a fresh user the same way RegisterSerializer does
print("\n=== CREATING TEST USER ===")
test_email = "testlogin@test.com"
test_pw = "TestPass123!"
User.objects.filter(email=test_email).delete()
user = User.objects.create_user(
    username="testloginuser",
    email=test_email,
    name="Test User",
    password=test_pw,
)
print(f"Created: email={user.email}, username={user.username}")
print(f"Password usable: {user.has_usable_password()}")
print(f"check_password(correct): {user.check_password(test_pw)}")
print(f"check_password(wrong):   {user.check_password('wrongpass')}")

# Now test authenticate both ways
print("\n=== AUTHENTICATE TESTS ===")
r1 = authenticate(email=test_email, password=test_pw)
print(f"authenticate(email=..., pw=correct)  => {r1}")

r2 = authenticate(email=test_email, password="wrongpass")
print(f"authenticate(email=..., pw=wrong)    => {r2}")

r3 = authenticate(username="testloginuser", password=test_pw)
print(f"authenticate(username=..., pw=correct) => {r3}")

# Test via the actual serializer
print("\n=== SERIALIZER TEST ===")
from users.serializers import LoginSerializer
s = LoginSerializer(data={"email": test_email, "password": test_pw})
try:
    s.is_valid(raise_exception=True)
    print(f"LoginSerializer PASSED - user: {s.validated_data['user']}")
except Exception as e:
    print(f"LoginSerializer FAILED - {e}")

# Clean up
User.objects.filter(email=test_email).delete()
print("\nDone. Cleaned up test user.")
