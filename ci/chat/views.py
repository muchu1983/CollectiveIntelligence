# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.http import JsonResponse
from django.shortcuts import render
from core.utility.raid import RaidUtility
from chat.utility.websocket import WebsocketUtility
from chat.models import CIChatMessage

#聊天頻道
def channel(request, strCIUserUID=None):
    raidUtil = RaidUtility()
    userHost = raidUtil.getUserByCIUSerUID(strCIUserUID=strCIUserUID)
    return render(request, "chat/channel.html", locals())
    
#讀取 頻道歷史訊息
def loadHistoryMessage(request, strCIUserUID=None):
    raidUtil = RaidUtility()
    wsUtil = WebsocketUtility()
    userHost = raidUtil.getUserByCIUSerUID(strCIUserUID=strCIUserUID)
    strLoadResult = None
    lstDicHistoryMessage = []
    if request.method == "POST":
        #排序 舊到新
        qsetCIChatMsgHistory = CIChatMessage.objects.filter(strChannelID=strCIUserUID).order_by("dtCreated")
        #保留最新 666 筆
        if qsetCIChatMsgHistory.count() > 666:
            #反轉排序為 新到舊 取得最新 666 筆 id 列表
            lstIdToKeepCIChatMsgHistory = qsetCIChatMsgHistory.reverse()[:666].values_list("id", flat=True)
            #除了這 666 筆 id 以外皆刪除
            qsetCIChatMsgHistory.exclude(pk__in=list(lstIdToKeepCIChatMsgHistory)).delete()
        for cichatmsgHistory in qsetCIChatMsgHistory:
            #轉為 json 物件
            dicHistoryMessage = wsUtil.buildWsJsonMessage(
                strRole=cichatmsgHistory.strRole,
                strMsgAlign=cichatmsgHistory.strMessageAlign,
                strMsg=cichatmsgHistory.strMessageContent,
                strVisitorDisplayName=cichatmsgHistory.ciuserSender.strDisplayName if cichatmsgHistory.ciuserSender else "路人"
            )
            lstDicHistoryMessage.append(dicHistoryMessage)
        strLoadResult = "完成 讀取頻道歷史訊息"
    else:
        strLoadResult = "只允許 POST 方式 讀取頻道歷史訊息"
    return JsonResponse({"load_result":strLoadResult, "lstDicHistoryMessage":lstDicHistoryMessage}, safe=False)

