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
        return [kwargs.get("strChannelRoom")]
        
    #建立連線
    def connect(self, message, **kwargs):
        logging.info("accept join room: {strChannelRoom}".format(strChannelRoom=kwargs.get("strChannelRoom")))
        #回傳同意建立連線
        self.message.reply_channel.send({"accept": True})
        
    #接收訊息
    def receive(self, content, **kwargs):
        wsUtil = WebsocketUtility()
        raidUtil = RaidUtility()
        strChannelRoom = kwargs.get("strChannelRoom")
        strVisitorCIUserUID = content.get("strVisitorCIUserUID", None)
        strType = content.get("strType", None)
        strMsg = content.get("strMsg", None)
        #嘗試取得 使用者 物件
        userVisitor = raidUtil.getUserByCIUSerUID(strCIUserUID=strVisitorCIUserUID)
        #系統訊息
        if strType == "type:sys":
            #有新使用者加入頻道
            if strMsg == "hello":
                #建構回覆訊息
                strRespMsg = "Anonymous joined."
                if userVisitor is not None:
                    strRespMsg = "{strVisitorDisplayName} joined.".format(strVisitorDisplayName=userVisitor.ciuser.strDisplayName)
                jsonRespMsg = wsUtil.buildWsJsonMessage(strRole="role:sys", strAlign="align:center", strMsg=strRespMsg)
                self.group_send(strChannelRoom, jsonRespMsg)
        #動作訊息
        elif strType == "type:action":
            pass
        #大喊訊息
        elif strType == "type:yell":
            jsonRespMsg = wsUtil.buildWsJsonMessage(strRole="role:sys", strAlign="align:center", strMsg=strMsg)
            self.group_send(strChannelRoom, jsonRespMsg)
        #密語訊息
        elif strType == "type:whisper":
            pass
        else:
            pass
            
    #離線
    def disconnect(self, message, **kwargs):
        pass

#todo delete below
#聊天 websockets 訊息處理器
class ChatConsumer(JsonWebsocketConsumer):
    
    http_user = True
    channel_session_user = True
    strict_ordering = False
    slight_ordering = False
    
    #加入房間
    def connection_groups(self, **kwargs):
        return [kwargs.get("ci_room")]
        
    #建立連線
    def connect(self, message, **kwargs):
        #回傳同意建立連線
        self.message.reply_channel.send({"accept": True})
        
    #接收訊息
    def receive(self, content, **kwargs):
        strRoom = kwargs.get("ci_room")
        strType = content.get("ci_type", None)
        strMsg = content.get("ci_msg", None)
        dicRespData = {"ci_recv": content}
        if strType == "ci_sys" and strMsg == "ci_join":
            #有新使用者加入
            dicRespData.setdefault("ci_type", "ci_sys")
            dicRespData.setdefault("ci_msg", "ci_welcome")
            dicRespData.setdefault("ci_user", self.message.user.username)
            self.group_send(strRoom, dicRespData)
        elif strType == "ci_chat":
            #聊天訊息
            dicRespData.setdefault("ci_type", "ci_chat")
            dicRespData.setdefault("ci_msg", strMsg)
            dicRespData.setdefault("ci_representative", content.get("ci_representative", None))
            dicRespData.setdefault("ci_user", self.message.user.username)
            self.group_send(strRoom, dicRespData)
            
    #離線
    def disconnect(self, message, **kwargs):
        pass
        