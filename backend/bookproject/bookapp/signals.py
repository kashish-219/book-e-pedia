from django.core.mail import send_mail
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.conf import settings

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    email_plaintext_message = (
        f"Someone asked for a password reset for email {reset_password_token.user.email}. "
        f"Follow the link below:\n\n"
        f"{settings.BASE_URL}/customer/reset-password/{reset_password_token.key}"
    )
    send_mail(
        'Password Reset E-mail',
        email_plaintext_message,
        settings.EMAIL_HOST_USER,  # From email
        [reset_password_token.user.email],  # To email
        fail_silently=False,
    )