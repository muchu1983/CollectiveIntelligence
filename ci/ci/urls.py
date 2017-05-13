# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
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
from quest import views as quest_views

urlpatterns = [
    url(r"^admin/", include(admin.site.urls)),
    #使用者帳號
    url(r"^accounts/register/$", core_views.register),
    url(r"^accounts/login/$", builtin_login, {"template_name": "core/accounts/login.html"}),
    url(r"^accounts/logout/$", builtin_logout, {"template_name": "core/main.html"}),
    url(r"^accounts/sendEmailVerification/$", core_views.sendEmailVerification),
    url(r"^accounts/verifyEmail/$", core_views.verifyEmail),
    url(r"^accounts/profiles/$", core_views.profiles),
    #搜尋
    url(r"^core/searchCIUser/$", core_views.searchCIUser),
    url(r"^core/searchLeader/$", core_views.searchLeader),
    #用戶
    url(r"^core/ciuserViewer/(?P<strCIUserUID>[0-9a-f-]{36})/$", core_views.ciuserViewer),
    #團隊
    url(r"^core/resetLeader/$", core_views.resetLeader),
    url(r"^core/clearLeader/$", core_views.clearLeader),
    url(r"^core/retrieveLstDicFollower/$", core_views.retrieveLstDicFollower),
    #首頁
    url(r"^core/main/$", core_views.renderMainPage),
    #聊天
    url(r"^chat/channel/(?P<strCIUserUID>[0-9a-f-]{36})/$", chat_views.channel),
    #任務
    url(r"^quest/initNewQuest/$", quest_views.initNewQuest),
    url(r"^quest/searchCIQuest/$", quest_views.searchCIQuest),
    url(r"^quest/questViewer/(?P<strQID>[0-9a-f-]{36})/$", quest_views.questViewer),
    url(r"^quest/deleteQuest/$", quest_views.deleteQuest),
    url(r"^quest/likeOrDislikeQuest/$", quest_views.likeOrDislikeQuest),
    url(r"^quest/applyQuest/$", quest_views.applyQuest),
    url(r"^quest/acceptApplication/$", quest_views.acceptApplication),
    url(r"^quest/rejectApplication/$", quest_views.rejectApplication),
    url(r"^quest/cancelApplication/$", quest_views.cancelApplication),
    url(r"^quest/abandonQuest/$", quest_views.abandonQuest),
    url(r"^quest/questReached/$", quest_views.questReached),
    url(r"^quest/terminateQuest/$", quest_views.terminateQuest),
    url(r"^quest/accomplishQuest/$", quest_views.accomplishQuest),
    url(r"^quest/questUnreachable/$", quest_views.questUnreachable),
]
