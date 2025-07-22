from django.urls import path
from . import views

urlpatterns = [
    path('admin/register/', views.admin_register, name='admin_register'),
    path('login/', views.login, name='login'),
    path('admin/create-event/', views.create_event, name='create_event'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('events/browse/', views.browse_events, name='browse_events'),
    path('events/generate-description/', views.generate_event_description, name='generate_event_description'),

     # User side
    path('user/register/', views.user_register, name='user_register'),
    path('user/login/', views.user_login, name='user_login'),
]
