from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        user = get_user_model()
        username = "userAdmin"
        password = "Test123!"
        email = "admin@example.com"

        if not user.objects.filter(username=username).exists():
            user.objects.create_superuser(
                username=username, email=email, password=password
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f"Superuser '{username}' has been created."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Superuser '{username}' already exist.")
            )
