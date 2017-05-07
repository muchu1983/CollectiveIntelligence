# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django import forms
from django.contrib.auth.models import User
from core.models import CIUser

class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ("email", )

class CIUserForm(forms.ModelForm):

    class Meta:
        model = CIUser
        fields = ("strDisplayName", )