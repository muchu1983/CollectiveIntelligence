# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging
from quest.models import CIQuest

class QuestUtility:
    
    #建構子
    def __init__(self):
        pass
        
    #以 strQID 查尋 CIQuest 物件
    def getCIQuestByQID(self, strQID=None):
        questTarget = None
        if strQID is not None:
            #查尋該任務
            questTarget = CIQuest.objects.filter(strQID=strQID).first()
        return questTarget
    
    #刪除任務
    def deleteQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人
        if questTarget.ciuserInitiator == ciuserRequest:
            questTarget.delete()
    
    #接受任務
    def acceptQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 除發起人以外的人
        if questTarget.ciuserInitiator == ciuserRequest:
            pass
        else:
            #儲存 ciuserExecutor 及 strState
            questTarget.ciuserExecutor = ciuserRequest
            questTarget.strState = "processing"
            questTarget.save()
    
    #放棄任務
    def abandonQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 執行人
        if questTarget.ciuserExecutor == ciuserRequest:
            #儲存 ciuserExecutor 及 strState
            questTarget.ciuserExecutor = None
            questTarget.strState = "new"
            questTarget.save()
    