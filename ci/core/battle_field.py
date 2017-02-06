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
        self.intFieldWidth = 800
        self.intFieldHeight = 600
        self.dicField = {
            "field_1":[
                {"name":"Red Queue", "position":(100, 100), "action":None},
                {"name":"Black Queue", "position":(300, 100), "action":None},
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
        
        
#螞蟻基礎類別
class BaseAnt(object):
    
    #建構子
    def __init__(self, intLife, intPositionX, intPositionY):
        self.intLife = intLife
        self.intPositionX = intPositionX
        self.intPositionY = intPositionY
        self.strStatus = "normal"

#蟻后 - 產卵 交配
class QueueAnt(BaseAnt):
    
    #建構子
    def __init__(self, intPositionX, intPositionY):
        #初始血量 1000
        super(QueueAnt, self).__init__(intLife=1000, intPositionX=intPositionX, intPositionY=intPositionY)
        #名稱
        self.strName = "Queue"
        #體型
        self.intSize = 10
    

#工蟻 - 搬運 戰鬥
class WorkerAnt(BaseAnt):
    
    #建構子
    def __init__(self, intPositionX, intPositionY):
        #初始血量 100
        super(QueueAnt, self).__init__(intLife=100, intPositionX=intPositionX, intPositionY=intPositionY)
        #名稱
        self.strName = "Worker"
        #體型
        self.intSize = 3

#兵蟻 - 戰鬥
class SoldiersAnt(BaseAnt):
    
    #建構子
    def __init__(self, intPositionX, intPositionY):
        #初始血量 300
        super(QueueAnt, self).__init__(intLife=300, intPositionX=intPositionX, intPositionY=intPositionY)
        #名稱
        self.strName = "Soldiers"
        #體型
        self.intSize = 5

#雄蟻 - 交配
class MaleAnt(BaseAnt):
    
    #建構子
    def __init__(self, intPositionX, intPositionY):
        #初始血量 100
        super(QueueAnt, self).__init__(intLife=100, intPositionX=intPositionX, intPositionY=intPositionY)
        #名稱
        self.strName = "Male"
        #體型
        self.intSize = 3