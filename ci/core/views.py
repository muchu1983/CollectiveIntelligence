# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm

#用戶註冊
def register(request):
    if request.method == "POST":
        formRegisterUser = UserCreationForm(request.POST)
        if formRegisterUser.is_valid():
            user = formRegisterUser.save()
            return redirect("/accounts/login/")
    else:
        formRegisterUser = UserCreationForm()
    return render(request, "registration/register.html", locals())
    
#主頁面
def renderMainPage(request):
    if not request.session.get("has_session", None):
        request.session["has_session"] = True
    return render(request, "main.html", {})