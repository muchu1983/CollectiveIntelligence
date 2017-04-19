# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging
from django.contrib.auth.models import User
from core.models import CIUser

class RaidUtility:
    
    #建構子
    def __init__(self):
        pass
        
    #重置 使用者的 領導人 並重置 PV 值
    def resetLeaderAndPV(self, user, strLeaderUID):
        pass
        
    #取得 使用者的 領導人
    def getLeader(self, user):
        pass
    
    #取得 使用者的 追隨者 列表
    def getLstFollower(self, user):
        pass
        
    #計算 使用者的 團隊 PV
    def calculateRaidPV(self, user):
        pass