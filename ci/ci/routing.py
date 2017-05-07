# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.routing import route
from channels.routing import route_class
from core import consumers as core_consumers
from chat import consumers as chat_consumers

channel_routing = [
    #chat
    route_class(chat_consumers.ChannelConsumer, path=r"^/ws/chat/channel/(?P<strHostCIUserUID>[0-9a-f-]{36})/$"),
    
    #todo delete below
    route_class(core_consumers.UidManageConsumer, path=r"^/ws/core/uidmanage/$"),
    route_class(core_consumers.BattleConsumer, path=r"^/ws/battle/(?P<field>[a-zA-Z0-9_]+)/$"),
]