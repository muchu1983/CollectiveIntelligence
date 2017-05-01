# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging
from channels.generic.websockets import JsonWebsocketConsumer
from channels import Group
from chat.utility.websocket import WebsocketUtility
from core.utility.raid import RaidUtility

class ChannelConsumer(JsonWebsocketConsumer):
    
    http_user = True
    channel_session_user = True
    strict_ordering = False
    slight_ordering = False
    
    #加入房間
    def connection_groups(self, **kwargs):
        strChannelRoom = kwargs.get("strHostCIUserUID", None)
        return [strChannelRoom]
        
    #建立連線
    def connect(self, message, **kwargs):
        logging.info("accept join room: {strHostCIUserUID}".format(strHostCIUserUID=kwargs.get("strHostCIUserUID", None)))
        #回傳同意建立連線
        self.message.reply_channel.send({"accept": True})
        
    #接收訊息
    def receive(self, content, **kwargs):
        wsUtil = WebsocketUtility()
        raidUtil = RaidUtility()
        strChannelRoom = kwargs.get("strHostCIUserUID", None)
        strVisitorCIUserUID = content.get("strVisitorCIUserUID", None)
        strType = content.get("strType", None)
        strMsg = content.get("strMsg", None)
        strMsgAlign = content.get("strMsgAlign", None)
        #嘗試取得 使用者 物件
        userVisitor = raidUtil.getUserByCIUSerUID(strCIUserUID=strVisitorCIUserUID)
        userHost = raidUtil.getUserByCIUSerUID(strCIUserUID=kwargs.get("strHostCIUserUID", None))
        #判斷 造訪者 的角色
        strRole = self.determineVisitorRole(userVisitor, userHost)
        #造訪者 顯示名稱
        strVisitorDisplayName = userVisitor.ciuser.strDisplayName if userVisitor else "Anonymous"
        #系統訊息
        if strType == "type:sys":
            #有新使用者加入頻道
            if strMsg == "hello":
                #建構回覆訊息
                strRespMsg = None
                if strRole == "role:anonymous":
                    strRespMsg = "Anonymous joined."
                else:
                    strRespMsg = "{strVisitorDisplayName} joined.".format(strVisitorDisplayName=userVisitor.ciuser.strDisplayName)
                #建構系統訊息
                jsonRespMsg = wsUtil.buildWsJsonMessage(strRole=strRole, strMsgAlign=strMsgAlign, strMsg=strRespMsg, strVisitorDisplayName=strVisitorDisplayName)
                self.group_send(strChannelRoom, jsonRespMsg)
        #動作訊息
        elif strType == "type:action":
            pass
        #大喊訊息
        elif strType == "type:yell":
            jsonRespMsg = wsUtil.buildWsJsonMessage(strRole=strRole, strMsgAlign=strMsgAlign, strMsg=strMsg, strVisitorDisplayName=strVisitorDisplayName)
            self.group_send(strChannelRoom, jsonRespMsg)
        #密語訊息
        elif strType == "type:whisper":
            pass
        else:
            pass
            
    #離線
    def disconnect(self, message, **kwargs):
        pass
    
    #判斷 造訪者 的角色
    def determineVisitorRole(self, userVisitor, userHost):
        raidUtil = RaidUtility()
        #預設為 路人
        strRole = "role:anonymous"
        #判斷 是否登入
        if userVisitor is not None:
            strRole = "role:ciuser"
            #判斷 是否為追隨者
            qsetCIUserFollower = raidUtil.getQsetFollower(user=userHost)
            for ciuserFollower in qsetCIUserFollower:
                if userVisitor.ciuser.strCIUserUID == ciuserFollower.strCIUserUID:
                    strRole = "role:follower"
                    break
            #判斷 是否為頻道主人
            if userVisitor.ciuser.strCIUserUID == userHost.ciuser.strCIUserUID:
                strRole = "role:host"
            #判斷 是否為領導人
            if raidUtil.isLeaderOrLeaderOfLeader(user=userHost, strLeaderUID=userVisitor.ciuser.strCIUserUID):
                strRole = "role:leader"
        return strRole
        