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
//用戶
var textUserLeft = null;
var textUserRight = null;
var intUserPVLeft = 0;
var intUserPVRight = 0;
var textUserPVLeft = null;
var textUserPVRight = null;
//任務
var intQuestRewardPV = 0;
var groupQuest = null;
var textQuestRewardPV = null;
var textQuestState = null;
var rasterQuestNew = null;
var rasterQuestMatching = null;
var rasterQuestProcessing = null;
var rasterQuestComplete = null;
var rasterQuestIncomplete = null;
var rasterQuestEndSuccess = null;
var rasterQuestEndFailure = null;
//發起任務
var groupInitQuestLeft = null;
var groupInitQuestRight = null;
//刪除任務
var groupDeleteQuestLeft = null;
var groupDeleteQuestRight = null;
//按贊
var rectThumbsupLeft = null;
var groupThumbsupLeft = null;
var rectThumbsupRight = null;
var groupThumbsupRight = null;
//申請執行任務
var groupApplyQuestLeft = null;
var groupApplyQuestRight = null;
//接受申請
var groupAcceptApplicationLeft = null;
var groupAcceptApplicationRight = null;
//拒絕申請
var groupRejectApplicationLeft = null;
var groupRejectApplicationRight = null;
//取消申請
var groupCancelApplicationLeft = null;
var groupCancelApplicationRight = null;
//成功達成目標 
var groupQuestReachedLeft = null;
var groupQuestReachedRight = null;
//終結任務
var groupTerminateQuestLeft = null;
var groupTerminateQuestRight = null;
//放棄任務
var groupAbandonQuestLeft = null;
var groupAbandonQuestRight = null;
//完成任務
var groupAccomplishQuestLeft = null;
var groupAccomplishQuestRight = null;
//任務已失敗
var groupQuestUnreachableLeft = null;
var groupQuestUnreachableRight = null;
//提示資訊文字
var textTooltipInfo = null;
var groupTooltipInfo = null;
//重置
var groupReset = null;

//初始化 #canvas_main 畫布
function initCanvasMain() {
    //初始化 物件
    initCanvasItemObject();
    //初始化 事件
    initCanvasEvent();
};

//初始化 物件
function initCanvasItemObject() {
    /* 路徑物件 */
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
        point: [view.size.width/4, 100],
        justification: "center",
        content: "A用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 28
    });
    textUserRight = new PointText({
        point: [view.size.width/4, 100],
        justification: "center",
        content: "B用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 28
    });
    //用戶圖示
    rasterUserLeft = new Raster("iconUser");
    rasterUserLeft.position = [100, 100];
    rasterUserRight = new Raster("iconUser");
    rasterUserRight.position = [view.size.width/2 - 100, 100];
    //用戶PV 文字
    textUserPVLeft = new PointText({
        point: rasterUserLeft.bounds.bottomCenter + [0,10],
        justification: "center",
        content: intUserPVLeft + " PV",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 10
    });
    textUserPVRight = new PointText({
        point: rasterUserRight.bounds.bottomCenter + [0,10],
        justification: "center",
        content: intUserPVRight + " PV",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 10
    });
    //任務外框
    circleQuest = new Path.Circle({
        center: view.center,
        radius: view.size.height/4,
        strokeColor: "black",
        fillColor: "lightgoldenrodyellow",
        strokeWidth: 2,
    });
    
    //任務文字
    textQuestTitle = new PointText({
        point: view.center-[0, view.size.height/4-20],
        justification: "center",
        content: "任務",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    textQuestRewardPV = new PointText({
        point: view.center-[0, view.size.height/4-40],
        justification: "center",
        content: "獎勵：" + intQuestRewardPV + " PV",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 10
    });
    textQuestState = new PointText({
        point: view.center+[0, view.size.height/4-20],
        justification: "center",
        content: "",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    //提示資訊外框
    rectTooltipInfo = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width/2,30],
        radius: 10,
        strokeColor: "black",
        fillColor: "orange",
        strokeWidth: 2,
    });
    //提示資訊文字
    textTooltipInfo = new PointText({
        point: [rectTooltipInfo.bounds.width/2, rectTooltipInfo.bounds.height/2+3],
        justification: "center",
        content: "infomation",
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    //左按贊按鈕
    rectThumbsupLeft = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        strokeColor: "black",
        fillColor: "pink",
        strokeWidth: 2,
    });
    rasterThumbsupLeft = new Raster("iconThumbsup");
    rasterThumbsupLeft.position = [rectThumbsupLeft.bounds.width/2, rectThumbsupLeft.bounds.height/2];
    rasterThumbsupLeft.scale(0.20);
    rasterThumbsupLeft.visible = true;
    //右按贊按鈕
    rectThumbsupRight = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        strokeColor: "black",
        fillColor: "pink",
        strokeWidth: 2,
    });
    rasterThumbsupRight = new Raster("iconThumbsup");
    rasterThumbsupRight.position = [rectThumbsupRight.bounds.width/2, rectThumbsupRight.bounds.height/2];
    rasterThumbsupRight.scale(0.20);
    rasterThumbsupRight.visible = true;
    
    /* 群組 */
    //用戶
    groupUserLeft = new Group({
        children: [rectUserLeft, textUserLeft, rasterUserLeft, textUserPVLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: true,
    });
    groupUserRight = new Group({
        children: [rectUserRight, textUserRight, rasterUserRight, textUserPVRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: true,
    });
    //任務
    groupQuest = new Group({
        children: [circleQuest, textQuestTitle, textQuestRewardPV, textQuestState],
        position: view.center,
        visible: false,
    });
    //提示資訊
    groupTooltipInfo = new Group({
        children: [rectTooltipInfo, textTooltipInfo],
        position: view.bounds.bottomCenter+[0, -50],
        visible: false,
    });
    //按贊按鈕
    groupThumbsupLeft = new Group({
        children: [rectThumbsupLeft, rasterThumbsupLeft],
        position: [view.size.width*1/4, view.size.height/2+50],
        visible: false,
    });
    groupThumbsupRight = new Group({
        children: [rectThumbsupRight, rasterThumbsupRight],
        position: [view.size.width*3/4, view.size.height/2+50],
        visible: false,
    });
    
    //發起任務 按鈕
    groupInitQuestLeft = buildGroupButtonItem("發起任務", [view.size.width*1/4, view.size.height/2], true, null);
    groupInitQuestRight = buildGroupButtonItem("發起任務", [view.size.width*3/4, view.size.height/2], true, null);
    //刪除任務 按鈕
    groupDeleteQuestLeft = buildGroupButtonItem("刪除任務", [view.size.width*1/4, view.size.height/2], false, null);
    groupDeleteQuestRight = buildGroupButtonItem("刪除任務", [view.size.width*3/4, view.size.height/2], false, null);
    //申請執行任務 按鈕
    groupApplyQuestLeft = buildGroupButtonItem("申請執行任務", [view.size.width*1/4, view.size.height/2], false, null);
    groupApplyQuestRight = buildGroupButtonItem("申請執行任務", [view.size.width*3/4, view.size.height/2], false, null);
    //接受申請 按鈕
    groupAcceptApplicationLeft = buildGroupButtonItem("接受申請", [view.size.width*1/4, view.size.height/2], false, null);
    groupAcceptApplicationRight = buildGroupButtonItem("接受申請", [view.size.width*3/4, view.size.height/2], false, null);
    //拒絕申請 按鈕
    groupRejectApplicationLeft = buildGroupButtonItem("拒絕申請", [view.size.width*1/4, view.size.height/2+50], false, null);
    groupRejectApplicationRight = buildGroupButtonItem("拒絕申請", [view.size.width*3/4, view.size.height/2+50], false, null);
    //取消申請 按鈕
    groupCancelApplicationLeft = buildGroupButtonItem("取消申請", [view.size.width*1/4, view.size.height/2], false, null);
    groupCancelApplicationRight = buildGroupButtonItem("取消申請", [view.size.width*3/4, view.size.height/2], false, null);
    //成功達成目標 按鈕
    groupQuestReachedLeft = buildGroupButtonItem("成功達成目標", [view.size.width*1/4, view.size.height/2], false, null);
    groupQuestReachedRight = buildGroupButtonItem("成功達成目標", [view.size.width*3/4, view.size.height/2], false, null);
    //終結任務 按鈕
    groupTerminateQuestLeft = buildGroupButtonItem("終結任務", [view.size.width*1/4, view.size.height/2+50], false, "發起人將扣除 1/2 任務獎勵PV");
    groupTerminateQuestRight = buildGroupButtonItem("終結任務", [view.size.width*3/4, view.size.height/2+50], false, "發起人將扣除 1/2 任務獎勵PV");
    //放棄任務 按鈕
    groupAbandonQuestLeft = buildGroupButtonItem("放棄任務", [view.size.width*1/4, view.size.height/2], false, "執行人將扣除 1/2 任務獎勵PV");
    groupAbandonQuestRight = buildGroupButtonItem("放棄任務", [view.size.width*3/4, view.size.height/2], false, "執行人將扣除 1/2 任務獎勵PV");
    //完成任務 按鈕
    groupAccomplishQuestLeft = buildGroupButtonItem("完成任務", [view.size.width*1/4, view.size.height/2], false, "執行人將獲得 任務獎勵PV");
    groupAccomplishQuestRight = buildGroupButtonItem("完成任務", [view.size.width*3/4, view.size.height/2], false, "執行人將獲得 任務獎勵PV");
    //任務已失敗 按鈕
    groupQuestUnreachableLeft = buildGroupButtonItem("任務已失敗", [view.size.width*1/4, view.size.height/2], false, null);
    groupQuestUnreachableRight = buildGroupButtonItem("任務已失敗", [view.size.width*3/4, view.size.height/2], false, null);
    //重置 按鈕
    groupReset = buildGroupButtonItem("重置", [view.size.width*1/2, view.size.height-50], false, null);
    /* 任務圖示 */
    rasterQuestNew = new Raster("iconQuestStateNew");
    rasterQuestNew.position = view.center;
    rasterQuestNew.visible = false;
    rasterQuestMatching = new Raster("iconQuestStateMatching");
    rasterQuestMatching.position = view.center;
    rasterQuestMatching.visible = false;
    rasterQuestProcessing = new Raster("iconQuestStateProcessing");
    rasterQuestProcessing.position = view.center;
    rasterQuestProcessing.visible = false;
    rasterQuestComplete = new Raster("iconQuestStateComplete");
    rasterQuestComplete.position = view.center;
    rasterQuestComplete.visible = false;
    rasterQuestIncomplete = new Raster("iconQuestStateIncomplete");
    rasterQuestIncomplete.position = view.center;
    rasterQuestIncomplete.visible = false;
    rasterQuestEndSuccess = new Raster("iconQuestStateEndSuccess");
    rasterQuestEndSuccess.position = view.center;
    rasterQuestEndSuccess.visible = false;
    rasterQuestEndFailure = new Raster("iconQuestStateEndFailure");
    rasterQuestEndFailure.position = view.center;
    rasterQuestEndFailure.visible = false;
};

//事件
function initCanvasEvent() {
    //按贊按鈕 滑鼠事件
    groupThumbsupLeft.onMouseEnter = function(event){
        rectThumbsupLeft.fillColor = "red";
        textTooltipInfo.content = "按贊會增加 任務獎勵PV";
        groupTooltipInfo.visible = true;
    };
    groupThumbsupLeft.onMouseLeave = function(event){
        rectThumbsupLeft.fillColor = "pink";
        textTooltipInfo.content = "infomation";
        groupTooltipInfo.visible = false;
    };
    groupThumbsupLeft.onClick = function(event){
        intQuestRewardPV = intQuestRewardPV+10;
        textQuestRewardPV.content = "獎勵：" + intQuestRewardPV + " PV";
    };
    groupThumbsupRight.onMouseEnter = function(event){
        rectThumbsupRight.fillColor = "red";
        textTooltipInfo.content = "按贊會增加 任務獎勵PV";
        groupTooltipInfo.visible = true;
    };
    groupThumbsupRight.onMouseLeave = function(event){
        rectThumbsupRight.fillColor = "pink";
        textTooltipInfo.content = "infomation";
        groupTooltipInfo.visible = false;
    };
    groupThumbsupRight.onClick = function(event){
        intQuestRewardPV = intQuestRewardPV+10;
        textQuestRewardPV.content = "獎勵：" + intQuestRewardPV + " PV";
    };
    //左方按下發起任務
    groupInitQuestLeft.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserLeft.content = "發起人";
        groupDeleteQuestLeft.visible = true;
        groupApplyQuestRight.visible = true;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
        groupThumbsupRight.visible = true;
    };
    //右方按下發起任務
    groupInitQuestRight.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserRight.content = "發起人";
        groupDeleteQuestRight.visible = true;
        groupApplyQuestLeft.visible = true;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
        groupThumbsupLeft.visible = true;
    };
    //左方按下刪除任務
    groupDeleteQuestLeft.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶";
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
        rasterQuestNew.visible = false;
        textQuestState.content = "";
        groupThumbsupRight.visible = false;
        intQuestRewardPV = 0;
        textQuestRewardPV.content = "獎勵：" + intQuestRewardPV + " PV";
    };
    //右方按下刪除任務
    groupDeleteQuestRight.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserRight.content = "B用戶";
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
        rasterQuestNew.visible = false;
        textQuestState.content = "";
        groupThumbsupLeft.visible = false;
        intQuestRewardPV = 0;
        textQuestRewardPV.content = "獎勵：" + intQuestRewardPV + " PV";
    };
    //左方按下申請執行任務
    groupApplyQuestLeft.onClick = function(event){
        textUserLeft.content = "執行人";
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
        groupAcceptApplicationRight.visible = true;
        groupRejectApplicationRight.visible = true;
        groupCancelApplicationLeft.visible = true;
        rasterQuestNew.visible = false;
        rasterQuestMatching.visible = true;
        textQuestState.content = "配對中";
        groupThumbsupLeft.visible = false;
    };
    //右方按下申請執行任務
    groupApplyQuestRight.onClick = function(event){
        textUserRight.content = "執行人";
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
        groupAcceptApplicationLeft.visible = true;
        groupRejectApplicationLeft.visible = true;
        groupCancelApplicationRight.visible = true;
        rasterQuestNew.visible = false;
        rasterQuestMatching.visible = true;
        textQuestState.content = "配對中";
        groupThumbsupRight.visible = false;
    };
    //左方按下拒絕申請
    groupRejectApplicationLeft.onClick = function(event){
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        groupCancelApplicationRight.visible = false;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
        groupThumbsupRight.visible = true;
    };
    //右方按下拒絕申請
    groupRejectApplicationRight.onClick = function(event){
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        groupCancelApplicationLeft.visible = false;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
        groupThumbsupLeft.visible = true;
    };
    //左方按下取消申請
    groupCancelApplicationLeft.onClick = function(event){
        groupCancelApplicationLeft.visible = false;
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
        groupThumbsupLeft.visible = true;
    };
    //右方按下取消申請
    groupCancelApplicationRight.onClick = function(event){
        groupCancelApplicationRight.visible = false;
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
        groupThumbsupRight.visible = true;
    };
    //左方按下接受申請
    groupAcceptApplicationLeft.onClick = function(event){
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        groupCancelApplicationRight.visible = false;
        groupAbandonQuestRight.visible = true;
        groupQuestReachedLeft.visible = true;
        groupTerminateQuestLeft.visible = true;
        rasterQuestMatching.visible = false;
        rasterQuestProcessing.visible = true;
        textQuestState.content = "正在執行中";
    };
    //右方按下接受申請
    groupAcceptApplicationRight.onClick = function(event){
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        groupCancelApplicationLeft.visible = false;
        groupAbandonQuestLeft.visible = true;
        groupQuestReachedRight.visible = true;
        groupTerminateQuestRight.visible = true;
        rasterQuestMatching.visible = false;
        rasterQuestProcessing.visible = true;
        textQuestState.content = "正在執行中";
    };
    //左方按下放棄任務
    groupAbandonQuestLeft.onClick = function(event){
        groupAbandonQuestLeft.visible = false;
        groupQuestReachedRight.visible = false;
        groupTerminateQuestRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
        groupThumbsupLeft.visible = true;
        textUserPVLeft.content = intUserPVLeft + " PV(-" + intQuestRewardPV/2 + ")";
        textUserPVLeft.fillColor = "red";
        intUserPVLeft = intUserPVLeft - intQuestRewardPV/2;
    };
    //右方按下放棄任務
    groupAbandonQuestRight.onClick = function(event){
        groupAbandonQuestRight.visible = false;
        groupQuestReachedLeft.visible = false;
        groupTerminateQuestLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
        groupThumbsupRight.visible = true;
        textUserPVRight.content = intUserPVRight + " PV(-" + intQuestRewardPV/2 + ")";
        textUserPVRight.fillColor = "red";
        intUserPVRight = intUserPVRight - intQuestRewardPV/2;
    };
    
    //左方按下成功達成目標
    groupQuestReachedLeft.onClick = function(event){
        groupQuestReachedLeft.visible = false;
        groupTerminateQuestLeft.visible = false;
        groupAbandonQuestRight.visible = false;
        groupAccomplishQuestRight.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestComplete.visible = true;
        textQuestState.content = "目標達成";
    };
    //右方按下成功達成目標
    groupQuestReachedRight.onClick = function(event){
        groupQuestReachedRight.visible = false;
        groupTerminateQuestRight.visible = false;
        groupAbandonQuestLeft.visible = false;
        groupAccomplishQuestLeft.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestComplete.visible = true;
        textQuestState.content = "目標達成";
    };
    //左方按下終結任務
    groupTerminateQuestLeft.onClick = function(event){
        groupTerminateQuestLeft.visible = false;
        groupQuestReachedLeft.visible = false;
        groupAbandonQuestRight.visible = false;
        groupQuestUnreachableRight.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestIncomplete.visible = true;
        textQuestState.content = "目標已無法達成";
        textUserPVLeft.content = intUserPVLeft + " PV(-" + intQuestRewardPV/2 + ")";
        textUserPVLeft.fillColor = "red";
        intUserPVLeft = intUserPVLeft - intQuestRewardPV/2;
    };
    //右方按下終結任務
    groupTerminateQuestRight.onClick = function(event){
        groupTerminateQuestRight.visible = false;
        groupQuestReachedRight.visible = false;
        groupAbandonQuestLeft.visible = false;
        groupQuestUnreachableLeft.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestIncomplete.visible = true;
        textQuestState.content = "目標已無法達成";
        textUserPVRight.content = intUserPVRight + " PV(-" + intQuestRewardPV/2 + ")";
        textUserPVRight.fillColor = "red";
        intUserPVRight = intUserPVRight - intQuestRewardPV/2;
    };
    //左方按下完成任務
    groupAccomplishQuestLeft.onClick = function(event){
        groupAccomplishQuestLeft.visible = false;
        groupReset.visible = true;
        rasterQuestComplete.visible = false;
        rasterQuestEndSuccess.visible = true;
        textQuestState.content = "已終結-成功";
        textUserPVLeft.content = intUserPVLeft + " PV(+" + intQuestRewardPV + ")";
        textUserPVLeft.fillColor = "green";
        intUserPVLeft = intUserPVLeft + intQuestRewardPV;
    };
    //右方按下完成任務
    groupAccomplishQuestRight.onClick = function(event){
        groupAccomplishQuestRight.visible = false;
        groupReset.visible = true;
        rasterQuestComplete.visible = false;
        rasterQuestEndSuccess.visible = true;
        textQuestState.content = "已終結-成功";
        textUserPVRight.content = intUserPVRight + " PV (+" + intQuestRewardPV + ")";
        textUserPVRight.fillColor = "green";
        intUserPVRight = intUserPVRight + intQuestRewardPV;
    };
    //左方按下任務已失敗
    groupQuestUnreachableLeft.onClick = function(event){
        groupQuestUnreachableLeft.visible = false;
        groupReset.visible = true;
        rasterQuestIncomplete.visible = false;
        rasterQuestEndFailure.visible = true;
        textQuestState.content = "已終結-失敗";
    };
    //右方按下任務已失敗
    groupQuestUnreachableRight.onClick = function(event){
        groupQuestUnreachableRight.visible = false;
        groupReset.visible = true;
        rasterQuestIncomplete.visible = false;
        rasterQuestEndFailure.visible = true;
        textQuestState.content = "已終結-失敗";
    };
    //按下重置
    groupReset.onClick = function(event){
        groupReset.visible = false;
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶";
        textUserRight.content = "B用戶";
        rasterQuestEndSuccess.visible = false;
        rasterQuestEndFailure.visible = false;
        textQuestState.content = "";
        intQuestRewardPV = 0;
        textQuestRewardPV.content = "獎勵：" + intQuestRewardPV + " PV";
        textUserPVLeft.content = intUserPVLeft + " PV";
        textUserPVLeft.fillColor = "black";
        textUserPVRight.content = intUserPVRight + " PV";
        textUserPVRight.fillColor = "black";
    };
};

//滑鼠進入按鈕
function onMouseEnterButtonItem(bgItem, textItem, strTooltip){
    function wrapper(event){
        bgItem.fillColor = "red";
        textItem.fillColor = "white";
        if(strTooltip != null){
            textTooltipInfo.content = strTooltip;
            groupTooltipInfo.visible = true;
        }
    }
    return wrapper;
};
//滑鼠離開按鈕
function onMouseLeaveButtonItem(bgItem, textItem, strTooltip){
    function wrapper(event){
        bgItem.fillColor = "pink";
        textItem.fillColor = "black";
        if(strTooltip != null){
            textTooltipInfo.content = "infomation";
            groupTooltipInfo.visible = false;
        }
    }
    return wrapper;
};

//建構按鈕
function buildGroupButtonItem(strBtnContent, pointPosition, isVisible, strTooltip){
    //外框
    rectBtnItem = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    //文字
    textBtnItem = new PointText({
        point: [rectBtnItem.bounds.width/2, rectBtnItem.bounds.height/2+3],
        justification: "center",
        content: strBtnContent,
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    //群組
    groupBtnItem = new Group({
        children: [rectBtnItem, textBtnItem],
        position: pointPosition,
        visible: isVisible,
    });
    //事件
    groupBtnItem.onMouseEnter = onMouseEnterButtonItem(rectBtnItem, textBtnItem, strTooltip);
    groupBtnItem.onMouseLeave = onMouseLeaveButtonItem(rectBtnItem, textBtnItem, strTooltip);
    return groupBtnItem;
};