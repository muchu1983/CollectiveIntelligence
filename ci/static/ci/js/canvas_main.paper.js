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
//發起任務
var rectInitQuestLeft = null;
var rectInitQuestRight = null;
var textInitQuestLeft = null;
var textInitQuestRight = null;
var groupInitQuestLeft = null;
var groupInitQuestRight = null;
//刪除任務
var rectDeleteQuestLeft = null;
var rectDeleteQuestRight = null;
var textDeleteQuestLeft = null;
var textDeleteQuestRight = null;
var groupDeleteQuestLeft = null;
var groupDeleteQuestRight = null;
//申請執行任務
var rectApplyQuestLeft = null;
var rectApplyQuestRight = null;
var textApplyQuestLeft = null;
var textApplyQuestRight = null;
var groupApplyQuestLeft = null;
var groupApplyQuestRight = null;
//接受申請
var rectAcceptApplicationLeft = null;
var rectAcceptApplicationRight = null;
var textAcceptApplicationLeft = null;
var textAcceptApplicationRight = null;
var groupAcceptApplicationLeft = null;
var groupAcceptApplicationRight = null;
//拒絕申請
var rectRejectApplicationLeft = null;
var rectRejectApplicationRight = null;
var textRejectApplicationLeft = null;
var textRejectApplicationRight = null;
var groupRejectApplicationLeft = null;
var groupRejectApplicationRight = null;

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
    
    //左申請執行任務外框
    rectApplyQuestLeft = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //左申請執行任務文字
    textApplyQuestLeft = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "申請執行任務",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //右申請執行任務外框
    rectApplyQuestRight = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //右申請執行任務文字
    textApplyQuestRight = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "申請執行任務",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //左接受申請外框
    rectAcceptApplicationLeft = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //左接受申請文字
    textAcceptApplicationLeft = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "接受申請",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //右接受申請外框
    rectAcceptApplicationRight = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //右接受申請文字
    textAcceptApplicationRight = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "接受申請",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //左拒絕申請外框
    rectRejectApplicationLeft = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //左拒絕申請文字
    textRejectApplicationLeft = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "拒絕申請",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    
    //右拒絕申請外框
    rectRejectApplicationRight = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    
    //右拒絕申請文字
    textRejectApplicationRight = new PointText({
        point: [rectInitQuestLeft.bounds.width/2, rectInitQuestLeft.bounds.height/2+3],
        justification: "center",
        content: "拒絕申請",
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
    //發起任務
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
    //刪除任務
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
    //申請執行任務
    groupApplyQuestLeft = new Group({
        children: [rectApplyQuestLeft, textApplyQuestLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: false,
    });
    groupApplyQuestRight = new Group({
        children: [rectApplyQuestRight, textApplyQuestRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: false,
    });
    //接受申請
    groupAcceptApplicationLeft = new Group({
        children: [rectAcceptApplicationLeft, textAcceptApplicationLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: false,
    });
    groupAcceptApplicationRight = new Group({
        children: [rectAcceptApplicationRight, textAcceptApplicationRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: false,
    });
    //拒絕申請
    groupRejectApplicationLeft = new Group({
        children: [rectRejectApplicationLeft, textRejectApplicationLeft],
        position: [view.size.width*1/4, view.size.height/2+50],
        visible: false,
    });
    groupRejectApplicationRight = new Group({
        children: [rectRejectApplicationRight, textRejectApplicationRight],
        position: [view.size.width*3/4, view.size.height/2+50],
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
    groupApplyQuestLeft.onMouseEnter = onMouseEnterButtonItem(rectApplyQuestLeft, textApplyQuestLeft);
    groupApplyQuestRight.onMouseEnter = onMouseEnterButtonItem(rectApplyQuestRight, textApplyQuestRight);
    groupAcceptApplicationLeft.onMouseEnter = onMouseEnterButtonItem(rectAcceptApplicationLeft, textAcceptApplicationLeft);
    groupAcceptApplicationRight.onMouseEnter = onMouseEnterButtonItem(rectAcceptApplicationRight, textAcceptApplicationRight);
    groupRejectApplicationLeft.onMouseEnter = onMouseEnterButtonItem(rectRejectApplicationLeft, textRejectApplicationLeft);
    groupRejectApplicationRight.onMouseEnter = onMouseEnterButtonItem(rectRejectApplicationRight, textRejectApplicationRight);
    //滑鼠離開按鈕
    groupInitQuestLeft.onMouseLeave = onMouseLeaveButtonItem(rectInitQuestLeft, textInitQuestLeft);
    groupInitQuestRight.onMouseLeave = onMouseLeaveButtonItem(rectInitQuestRight, textInitQuestRight);
    groupDeleteQuestLeft.onMouseLeave = onMouseLeaveButtonItem(rectDeleteQuestLeft, textDeleteQuestLeft);
    groupDeleteQuestRight.onMouseLeave = onMouseLeaveButtonItem(rectDeleteQuestRight, textDeleteQuestRight);
    groupApplyQuestLeft.onMouseLeave = onMouseLeaveButtonItem(rectApplyQuestLeft, textApplyQuestLeft);
    groupApplyQuestRight.onMouseLeave = onMouseLeaveButtonItem(rectApplyQuestRight, textApplyQuestRight);
    groupAcceptApplicationLeft.onMouseLeave = onMouseLeaveButtonItem(rectAcceptApplicationLeft, textAcceptApplicationLeft);
    groupAcceptApplicationRight.onMouseLeave = onMouseLeaveButtonItem(rectAcceptApplicationRight, textAcceptApplicationRight);
    groupRejectApplicationLeft.onMouseLeave = onMouseLeaveButtonItem(rectRejectApplicationLeft, textRejectApplicationLeft);
    groupRejectApplicationRight.onMouseLeave = onMouseLeaveButtonItem(rectRejectApplicationRight, textRejectApplicationRight);
    //左方按下發起任務
    groupInitQuestLeft.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserLeft.content = "發起人-A用戶"
        groupDeleteQuestLeft.visible = true;
        groupApplyQuestRight.visible = true;
    };
    //右方按下發起任務
    groupInitQuestRight.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserRight.content = "發起人-B用戶"
        groupDeleteQuestRight.visible = true;
        groupApplyQuestLeft.visible = true;
    };
    //左方按下刪除任務
    groupDeleteQuestLeft.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶"
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
    };
    //右方按下刪除任務
    groupDeleteQuestRight.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserRight.content = "B用戶"
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
    };
    //左方按下申請執行任務
    groupApplyQuestLeft.onClick = function(event){
        textUserLeft.content = "A用戶-執行人"
        groupDeleteQuestRight.visible = false;
        groupAcceptApplicationRight.visible = true;
        groupRejectApplicationRight.visible = true;
    };
    //右方按下申請執行任務
    groupApplyQuestRight.onClick = function(event){
        textUserRight.content = "B用戶-執行人"
        groupDeleteQuestLeft.visible = false;
        groupAcceptApplicationLeft.visible = true;
        groupRejectApplicationLeft.visible = true;
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