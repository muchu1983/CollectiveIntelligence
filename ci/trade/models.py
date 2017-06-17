# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from django.db import models

class CIDeal(models.Model):
    #訂單編號 DID DB 索引鍵 建立後不可更改 操作 Deal 使用 DID
    strDID = models.CharField(db_index=True, editable=False, max_length=36, default=uuid.uuid1, null=False)
    #付款方式
    choicesPaymentType =[
        ("P2GEACC", "Pay2Go 電子帳戶"),
        ("CREDIT", "信用卡"),
        ("WEBATM", "線上 WebATM"),
        ("VACC", "實體 ATM 轉帳"),
        ("CVS", "超商代繳")
    ]
    strPaymentType = models.CharField(max_length=10, choices=choicesPaymentType, default="CREDIT", null=False)