# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import datetime
from datetime import timedelta
from django.utils import timezone

from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse

from quest.forms import CIQuestForm
from quest.models import CIQuest
from quest.models import CIQuestTag
from core.utility.raid import RaidUtility
from quest.utility.quest import QuestUtility

#發起新任務
@login_required
def initNewQuest(request):
    if request.method == "POST":
        strQuestTags = request.POST.get("inputQuestTags", "")
        lstStrQuestTag = strQuestTags.split(",")
        formCIQuest = CIQuestForm(request.POST)
        if formCIQuest.is_valid():
            #取得 from 資料
            strHeadline= formCIQuest.cleaned_data["strHeadline"]
            strContent = formCIQuest.cleaned_data["strContent"]
            #建立 CIQuest model
            ciquest = CIQuest(
                ciuserInitiator=request.user.ciuser,
                strHeadline=strHeadline,
                strContent=strContent,
                strState="new"
            )
            ciquest.save()
            #儲存 tag 關係 model
            for strQuestTag in lstStrQuestTag:
                #查尋 或 建立 tag
                (ciquesttag, isCreated) = CIQuestTag.objects.get_or_create(strName=strQuestTag)
                #建立關聯
                ciquest.setCIQuestTag.add(ciquesttag)
            return redirect("/quest/searchCIQuest/")
    else:
        formCIQuest = CIQuestForm()
    return render(request, "quest/initNewQuest.html", locals())
    
#尋找任務
def searchCIQuest(request):
    #尋找結果字串
    strSearchResult = None
    #尋找結果
    qsetMatchedCIQuest = None #搜尋 strKeyword 的結果
    qsetNewCIQuestTopReward = None #最高獎勵TOP5新任務
    qsetNewCIQuestToday = None #今天新任務 
    qsetNewCIQuestYesterday = None #昨天新任務
    qsetNewCIQuestWeekly = None #本周新任務(不含今天與昨天)
    if request.method == "POST":
        strKeyword = request.POST.get("strKeyword", None)
        #比對 strHeadline 條件
        queryHeadline = Q(strHeadline__iregex="^.*{strKeyword}.*$".format(strKeyword=strKeyword))
        #比對 strContent 條件
        queryContent = Q(strContent__iregex="^.*{strKeyword}.*$".format(strKeyword=strKeyword))
        #比對 setCIQuestTag 條件
        queryTagName = Q(setCIQuestTag__strName=strKeyword)
        #聯集所有條件
        queryObject = queryHeadline | queryContent | queryTagName
        #查尋
        qsetMatchedCIQuest = CIQuest.objects.filter(queryObject).distinct()
        strSearchResult = "搜尋 {strKeyword} 共找到 {intResultCount} 個任務".format(strKeyword=strKeyword, intResultCount=qsetMatchedCIQuest.count())
    else:
        #尋找可申請任務
        strSearchResult = "目前顯示最新的可申請任務"
        queryState = Q(strState="new") | Q(strState="matching")
        #最高獎勵TOP5 - 先比獎勵高-低 再比較時間 新-舊
        queryObject = queryState
        qsetNewCIQuestTopReward = CIQuest.objects.filter(queryObject).order_by("-intRewardPV", "-dtCreated").distinct()
        if qsetNewCIQuestTopReward.count() > 5:
            qsetNewCIQuestTopReward = qsetNewCIQuestTopReward[0:5]
        #今天
        dToday = timezone.localtime(timezone.now()).date()
        timeMin = datetime.time(hour=0, minute=0, second=0, tzinfo=timezone.get_current_timezone())
        timeMax = datetime.time(hour=23, minute=59, second=59, tzinfo=timezone.get_current_timezone())
        dtTodayMin = datetime.datetime.combine(dToday, timeMin)
        dtTodayMax = datetime.datetime.combine(dToday, timeMax)
        queryToday = Q(dtCreated__range=(dtTodayMin, dtTodayMax))
        queryObject = queryState & queryToday
        qsetNewCIQuestToday = CIQuest.objects.filter(queryObject).order_by("-dtCreated").distinct()
        #昨天
        dYesterday = dToday + timedelta(days=-1)
        dtYesterdayMin = datetime.datetime.combine(dYesterday, timeMin)
        dtYesterdayMax = datetime.datetime.combine(dYesterday, timeMax)
        queryYesterday = Q(dtCreated__range=(dtYesterdayMin, dtYesterdayMax))
        queryObject = queryState & queryYesterday
        qsetNewCIQuestYesterday = CIQuest.objects.filter(queryObject).order_by("-dtCreated").distinct()
        #本周(不含今天與昨天)
        dAWeekAgo = dToday + timedelta(days=-7)
        d2DayAgo = dToday + timedelta(days=-2)
        dtAWeekAgoMin = datetime.datetime.combine(dAWeekAgo, timeMin)
        dt2DayAgoMax = datetime.datetime.combine(d2DayAgo, timeMax)
        queryWeekly = Q(dtCreated__range=(dtAWeekAgoMin, dt2DayAgoMax))
        queryObject = queryState & queryWeekly
        qsetNewCIQuestWeekly = CIQuest.objects.filter(queryObject).order_by("-dtCreated").distinct()
    return render(request, "quest/searchCIQuest.html", locals())
    
#任務檢視頁
@login_required
def questViewer(request, strQID=None):
    questUtil = QuestUtility()
    questTarget = questUtil.getCIQuestByQID(strQID=strQID)
    if questTarget:
        isInitiator = False
        isApplicant = False
        isExecutor = False
        #檢查檢視者的身份
        if request.user.ciuser.strCIUserUID == questTarget.ciuserInitiator.strCIUserUID:
            #request 為 發起人
            isInitiator = True
            #設定 發起人 已檢視
            questTarget.isInitiatorViewed = True
            questTarget.save()
        if questTarget.ciuserExecutor and request.user.ciuser.strCIUserUID == questTarget.ciuserExecutor.strCIUserUID:
            #request 為 執行人
            isExecutor = True
            #設定 執行人 已檢視
            questTarget.isExecutorViewed = True
            questTarget.save()
        if request.user.ciuser in questTarget.setCIuserApplicant.all():
            #request 為 申請人
            isApplicant = True
        return render(request, "quest/questViewer.html", locals())
    else:
        return render(request, "core/notice.html", {"strMsg": "此任務已經不存在了！"})
    
#刪除 任務
@login_required
def deleteQuest(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #刪除任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.deleteQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 刪除任務"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#喜歡或取消喜歡 任務
@login_required
def likeOrDislikeQuest(request):
    #結果
    strResult = None
    isLiked = None
    if request.method == "POST":
        #取得任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        isLiked = questUtil.likeOrDislikeQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已切換 喜歡狀態"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"isLiked":isLiked, "strResult":strResult}, safe=False)
    
#申請執行任務
@login_required
def applyQuest(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #申請執行任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.applyQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 申請執行任務"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#接受申請
@login_required
def acceptApplication(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        strQID = request.POST.get("strQID", None)
        #檢查申請人
        strApplicantCIUserUID = request.POST.get("strApplicantCIUserUID", None)
        raidUtil = RaidUtility()
        userApplicant = raidUtil.getUserByCIUSerUID(strApplicantCIUserUID)
        if userApplicant is not None:
            #接受申請
            ciuserApplicant = userApplicant.ciuser
            questUtil = QuestUtility()
            questUtil.acceptApplication(ciuserRequest=request.user.ciuser, strQID=strQID, ciuserApplicant=ciuserApplicant)
            #完成字串
            strResult = "已完成 接受申請"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#拒絕申請
@login_required
def rejectApplication(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        strQID = request.POST.get("strQID", None)
        #檢查申請人
        strApplicantCIUserUID = request.POST.get("strApplicantCIUserUID", None)
        raidUtil = RaidUtility()
        userApplicant = raidUtil.getUserByCIUSerUID(strApplicantCIUserUID)
        if userApplicant is not None:
            #拒絕申請
            ciuserApplicant = userApplicant.ciuser
            questUtil = QuestUtility()
            questUtil.rejectApplication(ciuserRequest=request.user.ciuser, strQID=strQID, ciuserApplicant=ciuserApplicant)
            #完成字串
            strResult = "已完成 拒絕申請"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#取消申請
@login_required
def cancelApplication(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #取消申請
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.cancelApplication(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 取消申請"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#放棄 任務
@login_required
def abandonQuest(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #放棄任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.abandonQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 放棄任務"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#任務 成功達成目標
@login_required
def questReached(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #成功達成目標
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.questReached(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 成功達成目標"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#終結任務
@login_required
def terminateQuest(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #終結任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.terminateQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 終結任務"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#完成任務
@login_required
def accomplishQuest(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #完成任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.accomplishQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 完成任務"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
    
#任務已失敗
@login_required
def questUnreachable(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #任務已失敗
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.questUnreachable(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 任務已失敗"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"result":strResult}, safe=False)
