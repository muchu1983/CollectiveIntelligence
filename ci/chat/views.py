# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from core.utility.raid import RaidUtility

#聊天頻道
def channel(request, strCIUserUID=None):
    raidUtil = RaidUtility()
    userTarget = raidUtil.getUserByCIUSerUID(strCIUserUID=strCIUserUID)
    return render(request, "chat/channel.html", locals())


#
def renderChatPage(request):
    if not request.session.get("has_session", None):
        request.session["has_session"] = True
    return render(request, "chat.html", {})
