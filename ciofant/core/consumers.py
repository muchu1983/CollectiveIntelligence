# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.generic.websockets import JsonWebsocketConsumer

class ChatConsumer(JsonWebsocketConsumer):
    
    http_user = True
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