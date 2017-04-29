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
    def resetLeaderAndPV(self, user=None, strLeaderUID=None):
        #尋找 領導人
        ciuserLeader = CIUser.objects.get(
            strCIUserUID = strLeaderUID
        )
        #重設
        user.ciuser.leader = ciuserLeader
        user.ciuser.intPointVolume = 0
        #儲存
        user.save()
        
    #清除 使用者的 領導人
    def clearLeader(self, user=None):
        #清除
        user.ciuser.leader = None
        #儲存
        user.save()
        
    #取得 使用者的 領導人
    def getLeader(self, user=None):
        ciuserLeader = user.ciuser.leader
        if ciuserLeader is not None:
            return ciuserLeader.user
        else:
            #使用者 尚無 領導人
            return None
    
    #檢查 是否為使用者的 上層領導人之一
    def isLeaderOrLeaderOfLeader(self, user=None, strLeaderUID=None):
        isLeaderOrLeaderOfLeader = False
        userLeader = self.getLeader(user=user)
        while userLeader is not None:
            if userLeader.ciuser.strCIUserUID == strLeaderUID:
                isLeaderOrLeaderOfLeader = True
                break
            userLeader = self.getLeader(user=userLeader)
        return isLeaderOrLeaderOfLeader
    
    #取得 使用者的 追隨者 列表
    def getQsetFollower(self, user=None):
        #尋找 追隨者
        qsetCIUserFollower = CIUser.objects.filter(
            leader = user.ciuser
        )
        return qsetCIUserFollower
        
    #計算 使用者的 團隊 PV
    def calculateRaidPV(self, user=None):
        #自身 PV 值
        intRaidPV = user.ciuser.intPointVolume
        #加上 所有 追隨者 PV
        for ciuserFollower in self.getQsetFollower(user=user):
            intRaidPV += ciuserFollower.intPointVolume
        return intRaidPV
        
    #以 strCIUserUID 查尋 User 物件
    def getUserByCIUSerUID(self, strCIUserUID=None):
        userTarget = None
        if strCIUserUID is not None:
            #查尋該用戶
            ciuserTarget = CIUser.objects.filter(strCIUserUID=strCIUserUID).first()
            if ciuserTarget is not None:
                userTarget = ciuserTarget.user
        return userTarget