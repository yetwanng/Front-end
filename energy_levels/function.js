var defaultColor = '#333';

var $quadrant = $('#quadrant');
var $canvas = $quadrant.find('canvas');
$quadrant.css('margin-top', ($(window).height() - $canvas.height()) / 2);

var ctx = $canvas.get(0).getContext("2d");

// 绘制线条
function drawLine(ctx, config) {
    if(ctx && config && config.x0 && config.y0 && config.x1 && config.y1) {
        // 默认线条颜色为灰色
        var color = config.color;
        if(typeof(color) === 'undefined' || color.length <= 0) {
            color = defaultColor;
        }
        ctx.strokeStyle = color;

        // 绘制线条
        var x0 = config.x0,
            y0 = config.y0,
            x1 = config.x1,
            y1 = config.y1;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
}

// 绘制点
function drawPoint(ctx, config) {
    if(ctx && config && config.x && config.y) {
        config.x0 = config.x - 1;
        config.y0 = config.y - 1;
        config.x1 = config.x;
        config.y1 = config.y;
        drawLine(ctx, config);
    }
}


// 绘制尖角
function drawAngle(ctx, config) {
    var size = config.size ? config.size : 5;
    var top = config.top;
    var left = config.left;
    var mode = config.mode ? config.mode : 1;
    var color = config.color ? config.color : '';

    if(size && top && left && mode) {
        if(mode > 4 || mode < 1) {
            mode = 1;
        }
        var line1Config = {}, line2Config = {};
        line1Config.x0 = line2Config.x0 = left;
        line1Config.y0 = line2Config.y0 = top;
        switch(mode) {
            case 1:// 开口向左
                line1Config.x1 = left - size;
                line1Config.y1 = top + size;
                line2Config.x1 = left - size;
                line2Config.y1 = top - size;
                break;
            case 2:// 开口向上
                line1Config.x1 = left - size;
                line1Config.y1 = top - size;
                line2Config.x1 = left + size;
                line2Config.y1 = top - size;
                break;
            case 3:// 开口向右
                line1Config.x1 = left + size;
                line1Config.y1 = top + size;
                line2Config.x1 = left + size;
                line2Config.y1 = top - size;
                break;
            case 4:// 开口向下
                line1Config.x1 = left - size;
                line1Config.y1 = top + size;
                line2Config.x1 = left + size;
                line2Config.y1 = top + size;
                break;
        }

        drawLine(ctx, line1Config);
        drawLine(ctx, line2Config);
    }
}


// 创建坐标系
var cWidth = $canvas.get(0).width;
var cHeight = $canvas.get(0).height;
var qPadding = 50;
var qWidth = cWidth - qPadding * 2;
var qHeight = cHeight - qPadding * 2;
//绘制坐标轴
function createQuadrant(ctx) {
    // 绘制x轴
    var xLine = {
        x0: qPadding,
        y0: qPadding + qHeight,
        x1: qPadding + qWidth,
        y1: qPadding + qHeight
    };
    drawLine(ctx, xLine);
    drawAngle(ctx, {top: xLine.y1, left: xLine.x1, model: 2});

    // 绘制y轴
    var yLine = {
        x0: qPadding,
        y0: qPadding,
        x1: qPadding,
        y1: qPadding + qHeight
    };
    drawLine(ctx, yLine);
    drawAngle(ctx, {top: yLine.y0, left: yLine.x0, mode: 4});
}
createQuadrant(ctx);









// 绘制函数图像
function drawFunction(ctx, func) {
    // 绘制坐标系中的点
    function drawQuadrantPoint(x, y) {
        // 换算坐标系与画布中的点
        var cX = qPadding + qWidth / 2 + x;// canvas x
        if(cX > cWidth - qPadding) {
            cX = cWidth - qPadding;
        }
        if(cX < qPadding) {
            cx = qPadding;
        }
        var cY = qPadding + qHeight / 2 - y;
        if(cY > cHeight - qPadding) {
            cY = cHeight - qPadding;
        }
        if(cY < qPadding) {
            cY = qPadding;
        }
        drawPoint(ctx, {'x': cX, 'y': cY});
    }

    // 计算坐标系的最大最小值
    var minX = qWidth / -2, maxX = qWidth / 2;
    for(var i=minX; i<=maxX; i++) {
        var y = func(i);
        drawQuadrantPoint(i, y);
    }
}

// 清空坐标系
function resetQuadrant(ctx) {
    ctx.beginPath();
    ctx.clearRect(0, 0, cWidth, cHeight);
    createQuadrant(ctx);
}
//获取输入的函数
$(function() {
    var $func = $('input[name="func"]').val('Math.tan(x)');
    $('#draw').on('click', function(event) {
        resetQuadrant(ctx);
        var funcStr = $func.val();
        drawFunction(ctx, function(x) {
            return eval(funcStr);
        });
    }).click();
    $('#reset').on('click', function(event) {
        resetQuadrant(ctx);
    });
});