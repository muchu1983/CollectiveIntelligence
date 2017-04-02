# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.generic.websockets import JsonWebsocketConsumer
from channels import Group
from core.battle_field import BattleField

#戰鬥 websockets 訊息處理器
class BattleConsumer(JsonWebsocketConsumer):
    
    http_user = True
    channel_session_user = True
    strict_ordering = False
    slight_ordering = False
    
    #加入戰場
    def connection_groups(self, **kwargs):
        return [kwargs.get("field")]
    
    #建立連線
    def connect(self, message, **kwargs):
        #回傳同意建立連線
        message.reply_channel.send({"accept": True})
    
    #接收命令
    def receive(self, content, **kwargs):
        strMsg = content.get("msg", None)
        strField = kwargs.get("field")
        dicRespData = {"field": strField, "msg":strMsg}
        if strMsg == "sync":#同步
            lstDicFieldStatus = BattleField.getInstance().dicField.get(strField, [])
            dicRespData.setdefault("lstDicFieldStatus", lstDicFieldStatus)
            self.send(dicRespData)
        elif strMsg == "hello":#新命令
            self.group_send(strField, dicRespData)
    
    #離線
    def disconnect(self, message, **kwargs):
        pass

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