

$(function () {

    //印刷ボタンをクリックした時の処理
    $('.print-btn').click(function () {
        var canvasData = document.getElementById("canvas-area");
        var data = canvasData.toDataURL();
        var outputImg = document.getElementById("getImgTag");
        outputImg.src = data;
        outputImg.style.Width = canvasData.style.width;
        outputImg.style.Height = canvasData.style.Height;

        $('.print-area').append(outputImg);
        $('.printwarp').addClass('print');
        $('body > :not(.print)').addClass('print-off');
        window.print();
        $('.print').removeClass('print');
        $('.print-off').removeClass('print-off');

    });
});