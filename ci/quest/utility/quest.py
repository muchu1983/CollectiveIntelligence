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
    
               ↓---- all cancel ----↑                          ↑-- reached --> "complete" -- accomplish --> "end_success"
               ↓                    ↑                          ↑
    init ----->↓---- all reject ----↑                          ↑-- terminate --> "incomplete" -- unreachable --> "end_failure"
     ↑         ↓                    ↑                          ↑
   delete -- "new" -- apply --> "matching" -- accept --> "processing"
               ↑                                               ↓
               ↑---------------------- abandon ----------------↓
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
        
    """ 狀態 new (尚無人 申請執行任務) """
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
        #確認任務狀態
        if questTarget.ciuserInitiator != ciuserRequest and questTarget.strState == "new":
            #設定獎勵調整額度
            intPVDelta = 10
            #VIP 加成
            if questTarget.ciuserInitiator.isVIP:
                intPVDelta = 2*intPVDelta
            #加入或移出 setLikedCIUser
            if ciuserRequest in questTarget.setLikedCIUser.all():
                #調整 獎勵 PV
                questTarget.intRewardPV = questTarget.intRewardPV-intPVDelta
                questTarget.save()
                #移出 ciuser
                questTarget.setLikedCIUser.remove(ciuserRequest)
                isLiked = False
            else:
                #調整 獎勵 PV
                questTarget.intRewardPV = questTarget.intRewardPV+intPVDelta
                questTarget.save()
                #加入 ciuser
                questTarget.setLikedCIUser.add(ciuserRequest)
                isLiked = True
        return isLiked
    
    #申請執行任務
    def applyQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 除發起人以外的人
        if questTarget.ciuserInitiator != ciuserRequest and (questTarget.strState == "new" or questTarget.strState == "matching"):
            #加入 setCIuserApplicant 及 變更 strState
            questTarget.setCIuserApplicant.add(ciuserRequest)
            questTarget.strState = "matching"
            #設定 發起人 未檢視
            questTarget.isInitiatorViewed = False
            questTarget.save()
        
    """ 狀態 matching (已有人 申請執行任務 配對中) """
    #接受申請
    def acceptApplication(self, ciuserRequest=None, strQID=None, ciuserApplicant=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人 以及 目標申請人是否在申請人列表
        if questTarget.ciuserInitiator == ciuserRequest and \
        questTarget.strState == "matching" and \
        ciuserApplicant in questTarget.setCIuserApplicant.all():
            #清除申請人列表
            questTarget.setCIuserApplicant.clear()
            #設定執行人
            questTarget.ciuserExecutor = ciuserApplicant
            #儲存 strState
            questTarget.strState = "processing"
            #設定 執行人 未檢視
            questTarget.isExecutorViewed = False
            questTarget.save()
            
    #拒絕申請
    def rejectApplication(self, ciuserRequest=None, strQID=None, ciuserApplicant=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人 以及 目標申請人是否在申請人列表
        if questTarget.ciuserInitiator == ciuserRequest and \
        questTarget.strState == "matching" and \
        ciuserApplicant in questTarget.setCIuserApplicant.all():
            #移除該申請人
            questTarget.setCIuserApplicant.remove(ciuserApplicant)
            #儲存 strState
            if questTarget.setCIuserApplicant.all().count() == 0:
                questTarget.strState = "new"
                questTarget.save()
    
    #取消申請
    def cancelApplication(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 申請人
        if ciuserRequest in questTarget.setCIuserApplicant.all() and \
        questTarget.strState == "matching":
            #移除申請
            questTarget.setCIuserApplicant.remove(ciuserRequest)
            #儲存 strState
            if questTarget.setCIuserApplicant.all().count() == 0:
                questTarget.strState = "new"
            #設定 發起人 未檢視
            questTarget.isInitiatorViewed = False
            questTarget.save()
    
    """ 狀態 processing (已完成配對，正在執行中) """
    #放棄任務
    def abandonQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 執行人
        if questTarget.ciuserExecutor == ciuserRequest and questTarget.strState == "processing":
            #扣除 執行人 個人PV，扣除數量為本任務的 1/2 獎勵PV 值
            questTarget.ciuserExecutor.intPointVolume = questTarget.ciuserExecutor.intPointVolume-questTarget.intRewardPV/2
            if questTarget.ciuserExecutor.intPointVolume < 0:
                questTarget.ciuserExecutor.intPointVolume = 0
            questTarget.ciuserExecutor.save()
            #儲存 ciuserExecutor 及 strState
            questTarget.ciuserExecutor = None
            questTarget.strState = "new"
            #設定 發起人 未檢視
            questTarget.isInitiatorViewed = False
            questTarget.save()
    
    #成功達成目標
    def questReached(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人
        if questTarget.ciuserInitiator == ciuserRequest and questTarget.strState == "processing":
            #儲存 strState
            questTarget.strState = "complete"
            #設定 執行人 未檢視
            questTarget.isExecutorViewed = False
            questTarget.save()
            
    #終結任務
    def terminateQuest(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 發起人
        if questTarget.ciuserInitiator == ciuserRequest and questTarget.strState == "processing":
            #儲存 strState
            questTarget.strState = "incomplete"
            #設定 執行人 未檢視
            questTarget.isExecutorViewed = False
            questTarget.save()
            #扣除 發起人 個人PV，扣除數量為本任務的 1/2 獎勵PV 值
            questTarget.ciuserInitiator.intPointVolume = questTarget.ciuserInitiator.intPointVolume-questTarget.intRewardPV/2
            if questTarget.ciuserInitiator.intPointVolume < 0:
                questTarget.ciuserInitiator.intPointVolume = 0
            questTarget.ciuserInitiator.save()
        
    """ 狀態 complete (任務目標 達成) """
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
        
    """ 狀態 incomplete (任務目標 已無法達成) """
    #任務已失敗
    def questUnreachable(self, ciuserRequest=None, strQID=None):
        questTarget = self.getCIQuestByQID(strQID=strQID)
        #確認是否為 執行人
        if questTarget.ciuserExecutor == ciuserRequest and questTarget.strState == "incomplete":
            #儲存 strState
            questTarget.strState = "end_failure"
            questTarget.save()
            