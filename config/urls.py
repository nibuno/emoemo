"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
"""

import os
from django.contrib import admin
from django.urls import include, path
from dotenv import load_dotenv

from emoemo.views import index

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", index, name="index"),
]

load_dotenv()
# django_browser_reload が無限リロードするケースがあるので
# 制御出来るようにurlpatternsに追加する
if bool(int(os.getenv("USE_DJANGO_BROWSER_RELOAD", default=0))):
    urlpatterns.append(path("browser_reload/", include("django_browser_reload.urls")))

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# adminサイトはセキュリティ面を考えてenvファイルにADMIN_URLを設定している
urlpatterns.append(path(os.getenv("ADMIN_URL", "admin/"), admin.site.urls))
