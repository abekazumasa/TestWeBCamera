const canvasData = document.getElementById("canvas-area");


$(function () {

    //印刷ボタンをクリックした時の処理
    $('.print-btn').click(function () {
        var outputImg = document.getElementById("getImgTag");
        var data = canvasData.toDataURL();
        outputImg.style.Width ="30px";
        outputImg.style.Height = "30px";
        outputImg.src = data;
        $('.print-area').append(outputImg);
        $('.printwarp').addClass('print');
        $('body > :not(.print)').addClass('print-off');
        window.print();
        $('.print').removeClass('print');
        $('.print-off').removeClass('print-off');

    });
});