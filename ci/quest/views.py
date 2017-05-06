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
            return redirect("/quest/listNewQuest/")
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
