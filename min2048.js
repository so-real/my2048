var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    prepareForMobile(); //适应手机端预处理（准备工作）
    newgame();
});

function prepareForMobile() {

    if(documentWidth > 500){
        gridContainerWidth =500;
        cellSideLength = 100;
        cellSpace = 20;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02 * gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02 * cellSideLength);
}

function newgame() {
    //初始化棋盘格
    init();
    //在随机的两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            //getPosTop(i,j),getPosLeft(i,j) 传入i 和 j 的坐标值来计算每个小格子相应的位置
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    
    // 将board从一维数组增加到二维
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i] = new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0; //board二维数组初始化(0,0)
            hasConflicted[i][j] = false;
        }

    }
    updateBoardView();

    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove();  //如果有number-cell的值就先把前移除掉
    for (var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$('#number-cell-'+i+'-'+j);

            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//数字块的颜色不同
                theNumberCell.css('color',getNumberColor(board[i][j])); //方块内数字颜色不同
                theNumberCell.text(board[i][j]); //方块内数字值
            }
            hasConflicted[i][j] = false;
        }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber() {
    if(nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor(Math.random()*4) ); //parseInt:将Math随机的浮点说转化为整型
    var randy = parseInt( Math.floor(Math.random()*4) ); //parseInt:将Math随机的浮点说转化为整型

    var times = 0;
    while (times < 50){
        if(board[randx][randy]==0)
            break;

        randx = parseInt( Math.floor(Math.random()*4) );
        randy = parseInt( Math.floor(Math.random()*4) );

        times++;
    }
    if(times == 50){
        for(var i=0 ; i<4 ; i++)
            for(var j=0 ; j<4 ; j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;  //生成的随机数如果小于0.5就生成2，否则就生成4.

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);//生成数字现实过程的动画效果

    return true;
}

//给予玩家响应的游戏循环
//每按下一次“上下左右键”算一次响应，keyCode：键码值
$(document).keydown(function (event) {
    switch(event.keyCode){
        case 37: //left
            event.preventDefault(); // 阻挡按“上下左右”时的默认效果
            if(moveLeft()){  //判断是否可以按“左”键，如果可以，向左的同时生成一个新的随机数
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);  //判断游戏是否结束
            }
            break;
        case 38: //Up
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart',function (event) {
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY; //获取触控时（x,y）的坐标
});
document.addEventListener('touchmove',function (event) {
    event.preventDefault();
}); //阻挡触摸时的默认效果

document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY; //获取触控改变时的坐标位置（x,y）

    var deltax = endx - startx;
    var deltey = endy - starty;

    if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltey) < 0.3*documentWidth)
        return;

    //x
    if(Math.abs(deltax) >= Math.abs(deltey)){
        if (deltax > 0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move left
            if(moveLeft()){  //判断是否可以按“左”键，如果可以，向左的同时生成一个新的随机数
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);  //判断游戏是否结束
            }
        }
    }
    else{
        if(deltey > 0 ){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});



function moveLeft() {
    //判断是否可以moveleft  1.左边是否没有数字 2.左边数字是否和自己相等
    if(!canMoveLeft(board))
        return false;

    //moveleft  1.落脚位置是否为空  2.落脚位置数字和待判定元素数字是否相等 3.移动路径中是否有障碍物
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if(board[i][j] != 0){
                for(var k=0;k<j;k++){
                    // noBlockHorizontal:检验k，j之间是否有数字块
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k); //移动动画 从(i,j)到(i,k)
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j] ;
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp() {
    //判断是否可以moveup  1.上边是否没有数字 2.上边数字是否和自己相等
    if(!canMoveUp(board))
        return false;

    //moveup  1.落脚位置是否为空  2.落脚位置数字和待判定元素数字是否相等 3.移动路径中是否有障碍物
    for(var j=0;j<4;j++)
        for(var i=1;i<4;i++){
            if(board[i][j] != 0){
                for(var k=0;k<i;k++){
                    // noBlockHorizontal:检验k，j之间是否有数字块
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        //move
                        showMoveAnimation(i,j,k,j); //移动动画 从(i,j)到(i,k)
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j] ;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight() {
    //判断是否可以moveleft  1.右边是否没有数字 2.右边数字是否和自己相等
    if(!canMoveRight(board))
        return false;

    //moveright  1.落脚位置是否为空  2.落脚位置数字和待判定元素数字是否相等 3.移动路径中是否有障碍物
    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--){
            if(board[i][j] != 0){
                for(var k=3;k>j;k--){
                    // noBlockHorizontal:检验k，j之间是否有数字块
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k); //移动动画 从(i,j)到(i,k)
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j] ;
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown() {
    //判断是否可以moveDown  1.右边是否没有数字 2.右边数字是否和自己相等
    if(!canMoveDown(board))
        return false;

    //movedown  1.落脚位置是否为空  2.落脚位置数字和待判定元素数字是否相等 3.移动路径中是否有障碍物
    for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--){
            if(board[i][j] != 0){
                for(var k=3;k>i;k--){
                    // noBlockHorizontal:检验k，j之间是否有数字块
                    if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        //move
                        showMoveAnimation(i,j,k,j); //移动动画 从(i,j)到(i,k)
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j] ;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function isgameover() {
    if(nospace(board) && nomove(board)){
        gameover();
    }
}
function gameover() {
    alert("完了吧，瞅把你给能的！")
}