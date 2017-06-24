"""teamfinder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework import routers

from common.api import views as common_views
from feedback.api import views as feedback_views
from players.api import views as player_views
from teams.api import views as team_views
from common.views import deploy, social_redirect

router = routers.DefaultRouter()
router.register(r'applications', common_views.ApplicationViewSet)
router.register(r'feedback', feedback_views.FeedbackViewSet)
router.register(r'interests', common_views.InterestViewSet)
router.register(r'invitations', common_views.InvitationViewSet)
router.register(r'languages', common_views.LanguageViewSet)
router.register(r'players', player_views.PlayerViewSet)
router.register(r'regions', common_views.RegionViewSet)
router.register(r'positions', common_views.PositionViewSet)
router.register(r'teams', team_views.TeamViewSet)
router.register(r'memberships', common_views.MembershipViewSet)
router.register(r'user_email_preferences', common_views.UserEmailPreferencesViewSet)


urlpatterns = [
    url(r'^api/auth/', include('djoser.urls.authtoken')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^deploy/', deploy),
    url(r'^social-redirect/', social_redirect),
    url('', include('social_django.urls', namespace='social'))
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
