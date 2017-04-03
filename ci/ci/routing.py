# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.routing import route
from channels.routing import route_class
from core import consumers as core_consumers
from chat import consumers as chat_consumers

channel_routing = [
    route_class(core_consumers.UidManageConsumer, path=r"^/ws/core/uidmanage/$"),
    route_class(chat_consumers.ChatConsumer, path=r"^/ws/chat/(?P<ci_room>[a-zA-Z0-9_]+)/$"),
    route_class(core_consumers.BattleConsumer, path=r"^/ws/battle/(?P<field>[a-zA-Z0-9_]+)/$"),
]