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
    def buildWsJsonMessage(self, strMsg=None):
        jsonMsg = {
            "strMsg": strMsg
        }
        return jsonMsg;