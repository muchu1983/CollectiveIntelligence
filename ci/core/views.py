# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from django.http import JsonResponse

def renderMainPage(request):
    if not request.session.get("has_session", None):
        request.session["has_session"] = True
    return render(request, "main.html", {})
    
