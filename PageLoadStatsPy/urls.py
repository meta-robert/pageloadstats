from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()
from django.views.generic import TemplateView

urlpatterns = patterns('',
    #url(r'^/directory', TemplateView.as_view(template_name="directory.html")),
    url(r'^pls/', include('pageloadstats.urls')),
    #url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name':'login.html'}),
)
