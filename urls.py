from django.conf.urls.defaults import patterns, include, url
from views import *
import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'novel_v2.views.home', name='home'),
    # url(r'^novel_v2/', include('novel_v2.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    ('^main/$', Main),
)


media= patterns('',
	('^media/(?P<path>.*)$', 'django.views.static.serve',  
		{'document_root':settings.STATIC_DIR, 'show_indexes': True}),
)

urlpatterns+= media