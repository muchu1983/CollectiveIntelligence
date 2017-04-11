# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
"""ci URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import login as builtin_login
from django.contrib.auth.views import logout as builtin_logout
from core import views as core_views
from chat import views as chat_views

urlpatterns = [
    url(r"^admin/", include(admin.site.urls)),
    #使用者帳號
    url(r"^accounts/register/$", core_views.register),
    url(r"^accounts/login/$", builtin_login),
    url(r"^accounts/logout/$", builtin_logout),
    #主頁
    url(r"^main/$", core_views.renderMainPage),
    #CI聊天
    url(r"^chat/$", chat_views.renderChatPage),
]
