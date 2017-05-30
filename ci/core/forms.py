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
from snowpenguin.django.recaptcha2.fields import ReCaptchaField
from snowpenguin.django.recaptcha2.widgets import ReCaptchaWidget
from core.models import CIUser

#用戶註冊表單
class RegisterUserForm(UserCreationForm):

    captcha = ReCaptchaField(widget=ReCaptchaWidget(
        explicit=True,
        theme="light",
        type="image",
        size=None,
        tabindex=0,
        attrs={
            "theme": "clean",
            "lang": "zh-TW"
        }
    ))
    
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
        
#上傳個人頭像 表單
class UploadAvatarThumbnailForm(forms.ModelForm):
    
    avatarThumbnail = forms.ImageField()
    
    class Meta:
        model = CIUser
        fields = ("avatarThumbnail", )