# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from trade.forms import CIDealForm

#商城 主頁面
@login_required
def renderMallPage(request):
    return render(request, "trade/mall.html", locals())

#傳送 Pay2Go 交易參數
@login_required
def sendPay2goCIDeal(request):
    if request.method == "POST":
    
        formCIDeal = CIDealForm(request.POST)
        if formCIDeal.is_valid():
            
            return redirect("/trade//")
    else:
        formCIDeal = CIDealForm()
    return render(request, "trade/.html", locals())
