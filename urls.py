from django.conf.urls import patterns, include, url
import django.contrib.auth.views
# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()
from django.views.generic import TemplateView

urlpatterns = [
    #url(r'^/directory', TemplateView.as_view(template_name="directory.html")),
    url(r'^pls/', include('PageLoadStatsPy.pageloadstats.urls')),
    #url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$', django.contrib.auth.views.login, {'template_name':'login.html'})
]

