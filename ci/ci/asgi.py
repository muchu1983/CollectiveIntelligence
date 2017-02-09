# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os

from channels.asgi import get_channel_layer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ci.settings")

channel_layer = get_channel_layer()