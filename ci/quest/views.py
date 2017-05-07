# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from quest.forms import CIQuestForm
from quest.models import CIQuest
from django.db.models import Q
from django.http import JsonResponse
from quest.utility.quest import QuestUtility

#發起新任務
@login_required
def initNewQuest(request):
    if request.method == "POST":
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
            return redirect("/quest/searchCIQuest/")
    else:
        formCIQuest = CIQuestForm()
    return render(request, "quest/initNewQuest.html", locals())
    
#尋找任務
@login_required
def searchCIQuest(request):
    #尋找結果字串
    strSearchResult = None
    #尋找結果
    qsetMatchedCIQuest = None
    if request.method == "POST":
        strKeyword = request.POST.get("strKeyword", None)
        #比對 strHeadline 條件
        queryHeadline = Q(strHeadline__iregex="^.*{strKeyword}.*$".format(strKeyword=strKeyword))
        #比對 strContent 條件
        queryContent = Q(strContent__iregex="^.*{strKeyword}.*$".format(strKeyword=strKeyword))
        #聯集所有條件
        queryObject = queryHeadline | queryContent
        #查尋
        qsetMatchedCIQuest = CIQuest.objects.filter(queryObject)
        strSearchResult = "查尋 {strKeyword} 共找到 {intResultCount} 個任務".format(strKeyword=strKeyword, intResultCount=qsetMatchedCIQuest.count())
    else:
        strSearchResult = "請輸入搜尋字串"
    return render(request, "quest/searchCIQuest.html", locals())
    
#任務檢視頁
@login_required
def questViewer(request, strQID=None):
    questUtil = QuestUtility()
    questTarget = questUtil.getCIQuestByQID(strQID=strQID)
    isInitiator = False
    isExecutor = False
    if request.user.ciuser.strCIUserUID == questTarget.ciuserInitiator.strCIUserUID:
        #request 為 發起人
        isInitiator = True
    if questTarget.ciuserExecutor and request.user.ciuser.strCIUserUID == questTarget.ciuserExecutor.strCIUserUID:
        #request 為 執行人
        isExecutor = True
    return render(request, "quest/questViewer.html", locals())
    
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
        questTarget = questUtil.getCIQuestByQID(strQID=strQID)
        #加入或移出 setLikedCIUser
        if request.user.ciuser in questTarget.setLikedCIUser.all():
            #調整 獎勵 PV
            questTarget.intRewardPV = questTarget.intRewardPV-1
            questTarget.save()
            #移出 ciuser
            questTarget.setLikedCIUser.remove(request.user.ciuser)
            isLiked = False
        else:
            #調整 獎勵 PV
            questTarget.intRewardPV = questTarget.intRewardPV+1
            questTarget.save()
            #加入 ciuser
            questTarget.setLikedCIUser.add(request.user.ciuser)
            isLiked = True
        #完成字串
        strResult = "已切換 喜歡狀態"
    else:
        strResult = "只允許 POST 方式操作任務"
    return JsonResponse({"isLiked":isLiked, "strResult":strResult}, safe=False)
    
#接受 任務
@login_required
def acceptQuest(request):
    #結果 字串
    strResult = None
    if request.method == "POST":
        #接受任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.acceptQuest(ciuserRequest=request.user.ciuser, strQID=strQID)
        #完成字串
        strResult = "已完成 接受任務"
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