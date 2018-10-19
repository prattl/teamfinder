from django.conf import settings
from django.urls import include, path
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework import routers

from common.api import views as common_views
from feedback.api import views as feedback_views
from players.api import views as player_views
from teams.api import views as team_views
from tf_auth import views as tf_auth_views
from common.views import deploy, social_redirect

router = routers.DefaultRouter()
router.register(r'applications', common_views.ApplicationViewSet)
router.register(r'account', tf_auth_views.AcccountView)
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
    path('api/auth/', include('djoser.urls.authtoken')),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
    path('deploy/', deploy),
    path('s3/sign/', common_views.S3SignView.as_view()),
    path('social-redirect/', social_redirect),
    path('', include('social_django.urls', namespace='social'))
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
