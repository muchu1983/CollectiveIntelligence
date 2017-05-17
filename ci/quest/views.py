# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from quest.forms import CIQuestForm
from quest.models import CIQuest
from quest.models import CIQuestTag
from django.db.models import Q
from django.http import JsonResponse
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
        #比對 setCIQuestTag 條件
        queryTagName = Q(setCIQuestTag__strName=strKeyword)
        #聯集所有條件
        queryObject = queryHeadline | queryContent | queryTagName
        #查尋
        qsetMatchedCIQuest = CIQuest.objects.filter(queryObject).distinct()
        strSearchResult = "查尋 {strKeyword} 共找到 {intResultCount} 個任務".format(strKeyword=strKeyword, intResultCount=qsetMatchedCIQuest.count())
    else:
        strSearchResult = "請輸入搜尋字串"
    return render(request, "quest/searchCIQuest.html", locals())
    
#任務檢視頁
@login_required
def questViewer(request, strQID=None):
    questUtil = QuestUtility()
    questTarget = questUtil.getCIQuestByQID(strQID=strQID)
    if questTarget:
        isInitiator = False
        isExecutor = False
        if request.user.ciuser.strCIUserUID == questTarget.ciuserInitiator.strCIUserUID:
            #request 為 發起人
            isInitiator = True
        if questTarget.ciuserExecutor and request.user.ciuser.strCIUserUID == questTarget.ciuserExecutor.strCIUserUID:
            #request 為 執行人
            isExecutor = True
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
        #申請執行任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.acceptApplication(ciuserRequest=request.user.ciuser, strQID=strQID)
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
        #申請執行任務
        strQID = request.POST.get("strQID", None)
        questUtil = QuestUtility()
        questUtil.rejectApplication(ciuserRequest=request.user.ciuser, strQID=strQID)
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
        #申請執行任務
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
