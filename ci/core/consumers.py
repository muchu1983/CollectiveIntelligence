# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from channels.generic.websockets import JsonWebsocketConsumer
from channels import Group
from core.battle_field import BattleField
from core.models import BeDispatchedUID

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

#核心 UID管理 websockets 處理器
class UidManageConsumer(JsonWebsocketConsumer):
    
    http_user = True
    channel_session_user = True
    strict_ordering = False
    slight_ordering = False
    
    #無群組
    def connection_groups(self, **kwargs):
        return []
        
    #建立連線
    def connect(self, message, **kwargs):
        #回傳 同意建立連線
        self.message.reply_channel.send({"accept": True})
        
    #接收訊息
    def receive(self, content, **kwargs):
        strAction = content.get("ci_action", None)
        dicRespData = {"ci_recv_content": content}
        #建立 UID
        if strAction == "ci_create_uid":
            objBeDispatchedUID = BeDispatchedUID.objects.create()
            dicRespData.setdefault("ci_uid", str(objBeDispatchedUID.uuidUID))
            self.send(dicRespData)
        #刪除 UID
        elif strAction == "ci_delete_uid":
            strTargetUID = content.get("ci_target_uid", None)
            qsetBeDispatchedUID = BeDispatchedUID.objects.filter(uuidUID=uuid.UUID("{%s}"%strTargetUID))
            qsetBeDispatchedUID.delete()
            
    #離線
    def disconnect(self, message, **kwargs):
        pass