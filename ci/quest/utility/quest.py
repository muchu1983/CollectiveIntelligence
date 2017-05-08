# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging
from quest.models import CIQuest

class QuestUtility:
    """
    strState route graph:
                                      ↑-- reached --> "complete" -- accomplish --> "end_success"
                                      ↑
                                      ↑-- terminate --> "incomplete" -- unreachable --> "end_failure"
                                      ↑
    init --> "new" -- accept --> "processing"
               ↑                      ↓
               ↑------ abandon -------↓
    """
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
        if questTarget.ciuserInitiator == ciuserRequest and questTarget.strState == "new":
            questTarget.delete()
            
    #喜歡或取消喜歡
    def likeOrDislikeQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        isLiked = None
        #加入或移出 setLikedCIUser
        if ciuserRequest in questTarget.setLikedCIUser.all():
            #調整 獎勵 PV
            questTarget.intRewardPV = questTarget.intRewardPV-1
            questTarget.save()
            #移出 ciuser
            questTarget.setLikedCIUser.remove(ciuserRequest)
            isLiked = False
        else:
            #調整 獎勵 PV
            questTarget.intRewardPV = questTarget.intRewardPV+1
            questTarget.save()
            #加入 ciuser
            questTarget.setLikedCIUser.add(ciuserRequest)
            isLiked = True
        return isLiked
    
    #接受任務
    def acceptQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 除發起人以外的人
        if questTarget.ciuserInitiator != ciuserRequest and questTarget.strState == "new":
            #儲存 ciuserExecutor 及 strState
            questTarget.ciuserExecutor = ciuserRequest
            questTarget.strState = "processing"
            questTarget.save()
    
    #放棄任務
    def abandonQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 執行人
        if questTarget.ciuserExecutor == ciuserRequest and questTarget.strState == "processing":
            #儲存 ciuserExecutor 及 strState
            questTarget.ciuserExecutor = None
            questTarget.strState = "new"
            questTarget.save()
    
    #成功達成目標
    def questReached(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人
        if questTarget.ciuserInitiator == ciuserRequest and questTarget.strState == "processing":
            #儲存 strState
            questTarget.strState = "complete"
            questTarget.save()
            
    #終結任務
    def terminateQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人
        if questTarget.ciuserInitiator == ciuserRequest and questTarget.strState == "processing":
            #儲存 strState
            questTarget.strState = "incomplete"
            questTarget.save()
            #扣除 發起人 個人PV，扣除數量為本任務的 1/2 獎勵PV 值
            questTarget.ciuserInitiator.intPointVolume = questTarget.ciuserInitiator.intPointVolume-questTarget.intRewardPV/2
            if questTarget.ciuserInitiator.intPointVolume < 0:
                questTarget.ciuserInitiator.intPointVolume = 0
            questTarget.ciuserInitiator.save()
            
    #完成任務
    def accomplishQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 執行人
        if questTarget.ciuserExecutor == ciuserRequest and questTarget.strState == "complete":
            #儲存 strState
            questTarget.strState = "end_success"
            questTarget.save()
            #增加 執行人 個人PV，增加數量為本任務的 獎勵PV 值
            questTarget.ciuserExecutor.intPointVolume = questTarget.ciuserExecutor.intPointVolume+questTarget.intRewardPV
            questTarget.ciuserExecutor.save()
            
    #任務已失敗
    def questUnreachable(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 執行人
        if questTarget.ciuserExecutor == ciuserRequest and questTarget.strState == "incomplete":
            #儲存 strState
            questTarget.strState = "end_failure"
            questTarget.save()
            #扣除 執行人 個人PV，扣除數量為本任務的 1/2 獎勵PV 值
            questTarget.ciuserExecutor.intPointVolume = questTarget.ciuserExecutor.intPointVolume-questTarget.intRewardPV/2
            if questTarget.ciuserExecutor.intPointVolume < 0:
                questTarget.ciuserExecutor.intPointVolume = 0
            questTarget.ciuserExecutor.save()