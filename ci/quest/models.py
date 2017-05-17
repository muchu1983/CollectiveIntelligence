# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from django.db import models
from tinymce import models as tinymce_models
from core.models import CIUser

#CI任務標籤
class CIQuestTag(models.Model):
    strName = models.CharField(max_length=255, null=False)

#CI任務
class CIQuest(models.Model):
    #QID DB 索引鍵 建立後不可更改 操作 Quest 使用 QID
    strQID = models.CharField(db_index=True, editable=False, max_length=36, default=uuid.uuid1, null=False)
    #多對一 發起人
    ciuserInitiator = models.ForeignKey(CIUser, on_delete=models.CASCADE, related_name="initiator_set", null=False)
    #多對一 執行人
    ciuserExecutor = models.ForeignKey(CIUser, on_delete=models.SET_NULL, related_name="executor_set", default=None, null=True)
    #多對多 按贊人
    setLikedCIUser = models.ManyToManyField(CIUser)
    #多對多 任務標籤
    setCIQuestTag = models.ManyToManyField(CIQuestTag)
    #任務狀態
    strState = models.CharField(max_length=255, null=False)
    #任務標題
    strHeadline = models.CharField(max_length=255, null=False)
    #任務內容
    strContent = tinymce_models.HTMLField(null=False)
    #任務 建立時間
    dtCreated = models.DateTimeField(auto_now=True, null=False)
    #任務 過期時間
    dtExpire = models.DateTimeField(null=True)
    #獎勵 隨按贊人增加而增加
    intRewardPV = models.IntegerField(default=0, null=False)
    #群組 QGID 建立後不可更改 操作 QuestGroup 使用 QGID (備用-多人同解型任務可共用相同的 QGID)
    strQGID = models.CharField(editable=False, max_length=36, default=uuid.uuid1, null=False)
