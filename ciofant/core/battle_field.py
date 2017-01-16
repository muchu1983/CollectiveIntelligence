# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
#server 端戰場資訊
class BattleField:
    
    #singleton 實例
    instance = None
    
    #建構子
    def __init__(self):
        self.dicField = {
            "field_1":[
                {"name":"Red Queue", "position":(100, 100), "action":""},
            ]
        }
    
    #singleton 設計模式
    @staticmethod
    def getInstance():
        if not BattleField.instance:
            BattleField.instance = BattleField()
        return BattleField.instance
