//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

/*
strState route graph:

           ↓------ cancel ------↑                          ↑-- reached --> "complete" -- accomplish --> "end_success"
           ↓                    ↑                          ↑
init ----->↓------ reject ------↑                          ↑-- terminate --> "incomplete" -- unreachable --> "end_failure"
 ↑         ↓                    ↑                          ↑
delete -- "new" -- apply --> "matching" -- accept --> "processing"
           ↑                                               ↓
           ↑---------------------- abandon ----------------↓
*/

$(document).ready(initCanvasMain);

//全域變數
var textUserLeft = null;
var textUserRight = null;
var groupQuest = null;

var rectInitQuestLeft = null;
var rectInitQuestRight = null;
var textInitQuestLeft = null;
var textInitQuestRight = null;
var groupInitQuestLeft = null;
var groupInitQuestRight = null;

var rectDeleteQuestLeft = null;
var rectDeleteQuestRight = null;
var textDeleteQuestLeft = null;
var textDeleteQuestRight = null;
var groupDeleteQuestLeft = null;
var groupDeleteQuestRight = null;

//初始化 #canvas_main 畫布
function initCanvasMain() {
    //初始化 物件
    initCanvasItemObject();
    //初始化 事件
    initCanvasEvent();
};

//初始化 物件
function initCanvasItemObject() {
    //用戶外框
    rectUserLeft = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width/2-2, view.size.height],
        radius: 10,
        strokeColor: "red",
        strokeWidth: 2,
    });
    rectUserRight = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width/2-2, view.size.height],
        radius: 10,
        strokeColor: "blue",
        strokeWidth: 2,
    });
    
    //用戶文字
    textUserLeft = new PointText({
        point: [view.size.width/4, 20],
        justification: "center",
        content: "A用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    textUserRight = new PointText({
        point: [view.size.width/4, 20],
        justification: "center",
        content: "B用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    
    //任務外框
    circleQuest = new Path.Circle({
        center: view.center,
        radius: view.size.height/4,
        strokeColor: "black",
        fillColor: "gold",
        strokeWidth: 2,
    });
    //任務文字
    textQuest = new PointText({
        point: view.center-[0, view.size.height/4-20],
        justification: "center",
        content: "任務",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    
    //左發起任務外框
    rectInitQuestLeft = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    //左發起任務文字
    textInitQuestLeft = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "發起任務",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //右發起任務外框
    rectInitQuestRight = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    //右發起任務文字
    textInitQuestRight = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "發起任務",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //左刪除任務外框
    rectDeleteQuestLeft = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //左刪除任務文字
    textDeleteQuestLeft = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "刪除任務",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //右刪除任務外框
    rectDeleteQuestRight = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //右刪除任務文字
    textDeleteQuestRight = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "刪除任務",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //群組
    groupUserLeft = new Group({
        children: [rectUserLeft, textUserLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: true,
    });
    groupUserRight = new Group({
        children: [rectUserRight, textUserRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: true,
    });
    groupQuest = new Group({
        children: [circleQuest, textQuest],
        position: view.center,
        visible: false,
    });
    groupInitQuestLeft = new Group({
        children: [rectInitQuestLeft, textInitQuestLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: true,
    });
    groupInitQuestRight = new Group({
        children: [rectInitQuestRight, textInitQuestRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: true,
    });
    groupDeleteQuestLeft = new Group({
        children: [rectDeleteQuestLeft, textDeleteQuestLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: false,
    });
    groupDeleteQuestRight = new Group({
        children: [rectDeleteQuestRight, textDeleteQuestRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: false,
    });
};

//事件
function initCanvasEvent() {
    //滑鼠進入按鈕
    groupInitQuestLeft.onMouseEnter = onMouseEnterButtonItem(rectInitQuestLeft, textInitQuestLeft);
    groupInitQuestRight.onMouseEnter = onMouseEnterButtonItem(rectInitQuestRight, textInitQuestRight);
    groupDeleteQuestLeft.onMouseEnter = onMouseEnterButtonItem(rectDeleteQuestLeft, textDeleteQuestLeft);
    groupDeleteQuestRight.onMouseEnter = onMouseEnterButtonItem(rectDeleteQuestRight, textDeleteQuestRight);
    //滑鼠離開按鈕
    groupInitQuestLeft.onMouseLeave = onMouseLeaveButtonItem(rectInitQuestLeft, textInitQuestLeft);
    groupInitQuestRight.onMouseLeave = onMouseLeaveButtonItem(rectInitQuestRight, textInitQuestRight);
    groupDeleteQuestLeft.onMouseLeave = onMouseLeaveButtonItem(rectDeleteQuestLeft, textDeleteQuestLeft);
    groupDeleteQuestRight.onMouseLeave = onMouseLeaveButtonItem(rectDeleteQuestRight, textDeleteQuestRight);
    //左方按下發起任務
    groupInitQuestLeft.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserLeft.content = "發起人-A用戶"
        groupDeleteQuestLeft.visible = true;
    };
    //右方按下發起任務
    groupInitQuestRight.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserRight.content = "發起人-B用戶"
        groupDeleteQuestRight.visible = true;
    };
    //左方按下刪除任務
    groupDeleteQuestLeft.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶"
        groupDeleteQuestLeft.visible = false;
    };
    //右方按下刪除任務
    groupDeleteQuestRight.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "B用戶"
        groupDeleteQuestRight.visible = false;
    };
};

//滑鼠進入按鈕
function onMouseEnterButtonItem(bgItem, textItem){
    function wrapper(event){
        bgItem.fillColor = "red";
        textItem.fillColor = "white";
    }
    return wrapper;
};
//滑鼠離開按鈕
function onMouseLeaveButtonItem(bgItem, textItem){
    function wrapper(event){
        bgItem.fillColor = "pink";
        textItem.fillColor = "black";
    }
    return wrapper;
};
