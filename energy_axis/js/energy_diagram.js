
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
//水平标尺与canvas的距离
var HORIZONTAL_AXIS_MARGIN = 50;
//竖直标尺与canvas的距离
var VERTICAL_AXIS_MARGIN = 50;
//标尺起点
var AXIS_ORIGIN = {
    x: HORIZONTAL_AXIS_MARGIN,
    y: canvas.height - VERTICAL_AXIS_MARGIN
};
//坐标的顶部
var AXIS_TOP = VERTICAL_AXIS_MARGIN;
//坐标的长度
var AXIS_RIGHT = canvas.width - HORIZONTAL_AXIS_MARGIN;
//小标记的间隔
var HORIZONTAL_TICK_SPACING = 50;
var VERTICAL_TICK_SPACING = 50;
//坐标标记的范围
var AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x;
var AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP;
//纵向标记数目
var NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING;
//横向标记数目
var NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING;
var TICK_WIDTH = 8;
//标牌和坐标轴之间的距离
var SPACE_BETWEEN_ABELS_AND_AXIS = 20;
//能带图块的宽度
var energyBlockWidth = 50;
//能带块间隙
var energyBlockSpace = 5;


//画坐标轴（包括坐标线和箭头）
function drawAxes() {
    //数值标记的格式设置
    context.save();
    context.lineWidth = 1.0;
    context.fillStyle = "#000";
    context.strokeStyle = "#000";
    //画横向和纵向轴
    drawHorizontalAxis();
    drawVerticalAxis();
    //小标尺的格式设置
    context.lineWidth = 0.5;
    context.strokeStyle = "#000";
    drawVerticalAxisTicks();
//  横向小标尺省略
// drawHorizontalAxisTicks();
    drawAxisAngles();
    context.restore();
}
/*
//绘制水平的小标-省略

function drawHorizontalAxisTicks() {
    var deltaY;
    for (var i = 1; i < NUM_HORIZONTAL_TICKS; i++) {
        context.beginPath();
        //判断画的是大坐标还是短坐标
        if (i % 5 == 0) {
            deltaY = TICK_WIDTH;
        } else {
            deltaY = TICK_WIDTH / 2
        }
        context.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING,
            AXIS_ORIGIN.y - deltaY);
        context.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING,
            AXIS_ORIGIN.y + deltaY);
        context.stroke();
    }
}
*/


//绘制竖直的小标
function drawVerticalAxisTicks() {
    var deltaX;
    for (var i = 1; i < 10*NUM_VERTICAL_TICKS; i++) {
        context.beginPath();
        if (i % 10 === 0) {
            deltaX = TICK_WIDTH;
        } else {
            deltaX = TICK_WIDTH / 2;
        }
        context.moveTo(AXIS_ORIGIN.x,
            AXIS_ORIGIN.y - i/10 * VERTICAL_TICK_SPACING);
        context.lineTo(AXIS_ORIGIN.x + deltaX,
            AXIS_ORIGIN.y - i/10 * VERTICAL_TICK_SPACING);
        context.stroke();
    }
}

//画竖直线
function drawVerticalAxis() {
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
    context.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
    context.stroke();
}

//画水平线
function drawHorizontalAxis() {
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
    context.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y);
    context.stroke();
}

// 绘制箭头
function drawAxisAngles() {
//y轴箭头
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, VERTICAL_AXIS_MARGIN);
    context.lineTo(AXIS_ORIGIN.x-5,VERTICAL_AXIS_MARGIN+5);
    context.moveTo(AXIS_ORIGIN.x, VERTICAL_AXIS_MARGIN);
    context.lineTo(AXIS_ORIGIN.x+5,VERTICAL_AXIS_MARGIN+5);
//x轴箭头
    context.moveTo(AXIS_RIGHT, AXIS_ORIGIN.y);
    context.lineTo(AXIS_RIGHT-5.,AXIS_ORIGIN.y-5);
    context.moveTo(AXIS_RIGHT, AXIS_ORIGIN.y);
    context.lineTo(AXIS_RIGHT-5.,AXIS_ORIGIN.y+5);
    context.stroke();
}


//绘制标注
function drawAxisLabels() {
    context.fillStyle = "#000";

    drawVerticalAxisLabels();
}

 //绘制blocklabels

 function drawHorizontalAxisLabels(materialName, num) {
     context.textAlign = "center";
     context.textBaseline = "top";

      var i= num* (energyBlockSpace+energyBlockWidth) + HORIZONTAL_AXIS_MARGIN+energyBlockWidth/2;
     context.fillStyle ="black";
     context.fillText(materialName, i, AXIS_ORIGIN.y + SPACE_BETWEEN_ABELS_AND_AXIS);
 }

//     绘制竖直轴标注
function drawVerticalAxisLabels() {
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (var i = 0; i <= NUM_VERTICAL_TICKS; i++) {
        context.fillText(i-10, AXIS_ORIGIN.x - SPACE_BETWEEN_ABELS_AND_AXIS, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);
    }
}

//     画网格线的，省略
/*    function drawGrid(color, stepx, stepy) {
        context.save()
        context.strokeStyle = color;
        context.fillStyle = '#ffffff';
        context.lineWidth = 0.5;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, context.canvas.height);
            context.stroke();
        }
        for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(context.canvas.width, i);
            context.stroke();
        }
        context.restore();
    }
        drawGrid("lightgray", 10, 10);
    */



context.font = "13px Arial";
context.shadowColor = "#DDD";
context.shadowOffsetX = 3;
context.shadowOffsetY = 3;
context.shadowBlur = 5;

drawAxes();
drawAxisLabels();



//画出能带
function drawBlock(axisX, blockTop, blockBottom) {
    var blockWidth = energyBlockWidth;
    var blockHeight = VERTICAL_TICK_SPACING *( blockTop-blockBottom);
    // var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
    // var color = Math.floor(Math.random() * colors.length);
    var blockColor = $("#my-color").val();

    context.beginPath();
    var my_gradient=context.createLinearGradient((energyBlockWidth+energyBlockSpace)*axisX + HORIZONTAL_AXIS_MARGIN,-blockTop*VERTICAL_TICK_SPACING+VERTICAL_AXIS_MARGIN,(energyBlockWidth+energyBlockSpace)*axisX + HORIZONTAL_AXIS_MARGIN,-blockTop*VERTICAL_TICK_SPACING+VERTICAL_AXIS_MARGIN+blockHeight);
    context.fillStyle = my_gradient;
    my_gradient.addColorStop(0,blockColor);
    my_gradient.addColorStop(1,"white");
    context.fillRect( (energyBlockWidth+energyBlockSpace)*axisX + HORIZONTAL_AXIS_MARGIN, -blockTop*VERTICAL_TICK_SPACING+VERTICAL_AXIS_MARGIN,blockWidth,blockHeight);
    context.stroke();
}

//清空坐标系
function resetEnergyDiagram(context) {
    context.clearRect(0, 0, canvas.width , canvas.height);
    drawAxes();
    drawAxisLabels();
}




//操作函数
$(document).ready(function () {
    $("#my-color").colorpicker();

    var number=1;
    $("#plot").click(function(){
        var funcStrA = $("#ConductionBandBottom").val();
        var funcStrB = $("#ValenceBandTop").val();
        var materialName = $("#material").val();
        if (number <= 12) {
            drawBlock(number, funcStrA, funcStrB);
            drawHorizontalAxisLabels(materialName, number);
            number++;
        }
        else alert("超出作图区域！");

    });
    $("#delete").click(function(){
        resetEnergyDiagram(context);
        number=1;
    });

});

