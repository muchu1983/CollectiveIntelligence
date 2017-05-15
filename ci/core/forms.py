# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from captcha.fields import ReCaptchaField
from core.models import CIUser

#用戶註冊表單
class RegisterUserForm(UserCreationForm):

    captcha = ReCaptchaField(
        attrs={
            "theme" : "clean",
        }
    )
    
    #建構子
    def __init__(self, *args, **kwargs):
        super(RegisterUserForm, self).__init__(*args, **kwargs)

#個人資料表單 - User model
class ProfilesUserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ("email", )

#個人資料表單 - CIUser model
class ProfilesCIUserForm(forms.ModelForm):

    class Meta:
        model = CIUser
        fields = ("strDisplayName", )