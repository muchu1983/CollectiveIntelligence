# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from django import forms
from trade.models import CIDeal

class CIDealForm(forms.ModelForm):
    
    class Meta:
        model = CIDeal
        fields = ("strPaymentType",)
