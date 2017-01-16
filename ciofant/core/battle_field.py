# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import threading

#server 端戰場資訊
class BattleField(object):
    
    #singleton 實例
    __instance = None
    #threading 安全鎖
    __lock = threading.Lock()
    
    #建構子
    def __init__(self):
        self.dicField = {
            "field_1":[
                {"name":"Red Queue", "position":(100, 100), "action":""},
            ]
        }
    
    #singleton 設計模式
    @classmethod
    def getInstance(cls):
        #第一次檢查 instance 是否存在
        if not cls.__instance:
            #instance 不存在, 嘗試取得 lock
            with cls.__lock:
                #已擁有lock, 重覆檢查 instance 是否存在
                #因為有可能上一個 lock 擁有者已建立好 instance
                if not cls.__instance:
                    #建立 instance
                    cls.__instance = cls()
        return cls.__instance
        