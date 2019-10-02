documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92* documentWidth; //大方块
cellSideLength = 0.18 * documentWidth;//小方块
cellSpace = 0.04 * documentWidth;//小方块间的间距

function getPosTop(i,j) {
    return cellSpace + i*(cellSpace+cellSideLength);
}

function getPosLeft(i,j) {
    return cellSpace + j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch(number){
        case 2 : return"#eee4da" ;break;
        case 4 : return"#ede0c8" ;break;
        case 8 : return"#f2b179" ;break;
        case 16 : return"#f59563" ;break;
        case 32 : return"#f67c5f" ;break;
        case 64 : return"#f65e3b" ;break;
        case 128 : return"#edcf72" ;break;
        case 256 : return"#edcc61" ;break;
        case 512 : return"#9c0" ;break;
        case 1024 : return"#33b5e5" ;break;
        case 2048 : return"#09c" ;break;
        case 4096 : return"#a6c" ;break;
        case 8192 : return"#93c" ;break;
    }
    return "black";
}

function getNumberColor(number) {
    if(number <= 4)
        return "#776e65";
    return "white";
}

function nospace(board) {
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            if(board[i][j]==0)
                return false;
    return true;
}

//判断是否可以moveleft  1.左边是否没有数字 2.左边数字是否和自己相等
function canMoveLeft(board) {
    for(i=0;i<4;i++)
        for(j=1;j<4;j++)
            if(board[i][j] != 0)
                if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
                    return true;
    return false;
}



//判断是否可以moveup  1.左边是否没有数字 2.左边数字是否和自己相等
function canMoveUp(board) {
    for(j=0;j<4;j++)
        for(i=1;i<4;i++)
            if(board[i][j] != 0)
                if(board[i-1][j] == 0 || board[i-1][j] == board[i][j])
                    return true;
    return false;
}



//判断是否可以moveright  1.右边是否没有数字 2.右边数字是否和自己相等
function canMoveRight(board) {
    for(i=0;i<4;i++)
        for(j=2;j>=0;j--)
            if(board[i][j] != 0)
                if(board[i][j+1] == 0 || board[i][j+1] == board[i][j])
                    return true;
    return false;
}

function canMoveDown(board) {
    for(j=0;j<4;j++)
        for(i=2;i>=0;i--)
            if(board[i][j] != 0)
                if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
                    return true;
    return false;
}


// noBlockHorizontal:检验k，j之间是否有数字块
function noBlockHorizontal(row,col1,col2,board) {
    for(var i=col1+1 ; i<col2 ; i++)
        if(board[row][i] != 0)
            return false;
    return true;
}
function noBlockVertical(col,row1,row2,board) {
    for(var j=row1+1 ; j<row2 ; j++)
        if(board[j][col] != 0)
            return false;
    return true;
}

function nomove(board) {
    if(canMoveLeft(board)||canMoveRight(board)||canMoveUp(board)||canMoveDown(board))
        return false;
    return true;
}