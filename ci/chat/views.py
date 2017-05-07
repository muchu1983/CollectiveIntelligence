# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from core.utility.raid import RaidUtility

#聊天頻道
def channel(request, strCIUserUID=None):
    raidUtil = RaidUtility()
    userHost = raidUtil.getUserByCIUSerUID(strCIUserUID=strCIUserUID)
    return render(request, "chat/channel.html", locals())

