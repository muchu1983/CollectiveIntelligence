# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging

class WebsocketUtility:
    
    #建構子
    def __init__(self):
        pass
        
    #建構 標準的 websocket 訊息
    def buildWsJsonMessage(self, strRole=None, strAlign=None, strMsg=None):
        """
        strRole:
        role:sys
        role:leader
        role:host
        role:follower
        role:ciuser
        role:anonymous
        """
        jsonMsg = {
            "strRole": strRole,
            "strAlign": strAlign,
            "strMsg": strMsg
        }
        return jsonMsg;