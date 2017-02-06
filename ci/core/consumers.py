# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.generic.websockets import JsonWebsocketConsumer
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
    
    def connection_groups(self, **kwargs):
        print(self.path)
        print(self.message)
        print(kwargs)
        return [kwargs.get("room")]
        
    def connect(self, message, **kwargs):
        #回傳同意建立連線
        self.message.reply_channel.send({"accept": True})
        
    def receive(self, content, **kwargs):
        dicRespData = {
            "data": content,
            "user": self.message.user.username,
            "room": kwargs.get("room")
        }
        self.group_send(kwargs.get("room"), dicRespData)
        
    def disconnect(self, message, **kwargs):
        pass