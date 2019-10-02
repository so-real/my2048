function showNumberWithAnimation(i,j,randNumber) {
    var numberCall = $('#number-cell-'+i+'-'+j);

    numberCall.css('background-color',getNumberBackgroundColor(randNumber));
    numberCall.css('color',getNumberColor(randNumber));
    numberCall.text(randNumber);

//     animate() 方法执行 CSS 属性集的自定义动画。
// 该方法通过CSS样式将元素从一个状态改变为另一个状态。CSS属性值是逐渐改变的，这样就可以创建动画效果。
// 只有数字值可创建动画（比如 "margin:30px"）。字符串值无法创建动画（比如 "background-color:red"）。
// 注释：使用 "+=" 或 "-=" 来创建相对动画（relative animations）。
    numberCall.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);
}

function showMoveAnimation(fromx,fromy,tox,toy) {
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updateScore(score) {
    $('#score').text(score);
}
