# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.db import models
from core.models import CIUser

#CI聊天訊息
class CIChatMessage(models.Model):
    #頻道 ID
    strChannelID = models.CharField(editable=False, max_length=36, null=False)
    #多對一 發送者
    ciuserSender = models.ForeignKey(CIUser, on_delete=models.SET_NULL, null=True)
    #訊息內容
    strMessageContent = models.CharField(max_length=255, null=False)
    #訊息對齊方向
    strMessageAlign = models.CharField(max_length=255, null=False)
    #任務 建立時間
    dtCreated = models.DateTimeField(auto_now=True, null=False)
