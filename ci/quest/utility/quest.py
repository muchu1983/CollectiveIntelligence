# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import logging
from quest.models import CIQuest

class QuestUtility:
    
    #建構子
    def __init__(self):
        pass
        
    #以 strQID 查尋 CIQuest 物件
    def getCIQuestByQID(self, strQID=None):
        questTarget = None
        if strQID is not None:
            #查尋該任務
            questTarget = CIQuest.objects.filter(strQID=strQID).first()
        return questTarget