# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from django.db import models

# 已配發的使用者 UID
class BeDispatchedUID(models.Model):
    #UID
    uuidUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #最後更新時間
    dtLatestUpdateTime = models.DateTimeField(auto_now=True, null=False)
