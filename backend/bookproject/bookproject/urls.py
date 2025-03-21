"""
URL configuration for bookproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

    http post http://127.0.0.1:8000/api/token/ username=Kashish219 password=Kashish21

    http http://127.0.0.1:8000/api/employees/ "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1NTQ3MTA4LCJpYXQiOjE3MzU1NDY4MDgsImp0aSI6ImNkYmQ4Mzk1ODBlNTQ2Yzc4Y2ZkODdkNzhkOTI4ZjQyIiwidXNlcl9pZCI6MX0.faVsSdTGLW6AddxIFcb6cEbY85Pmz9NRO47SakVHhcQ"

    http http://127.0.0.1:8000/api/token/refresh/ refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNTYzMzMxNiwiaWF0IjoxNzM1NTQ2OTE2LCJqdGkiOiJkYWQ5YmJmOTQzODk0OTViYjc3Mzk4YmQxZjdhOTM0ZCIsInVzZXJfaWQiOjF9.a7Udmvw2KQ0bpYKNXgc1Hrn8CqNwT9kuXCDQ6FQ3ZZw
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/",include('bookapp.urls')),  #Application which we have created
    path("",include('bookapp.urls')),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path("api-auth/ ",include('rest_framework.urls')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),  # Added for password reset

]

urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
