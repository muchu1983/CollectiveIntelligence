# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.generic.websockets import JsonWebsocketConsumer

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
        self.message.reply_channel.send({"accept": True})
    
    #接收命令
    def receive(self, content, **kwargs):
        dicRespData = {
            "data": content,
            "user": self.message.user.username,
            "field": kwargs.get("field")
        }
        self.group_send(kwargs.get("field"), dicRespData)
    
    #離線
    def disconnect(self, message, **kwargs):
        pass

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