
const canvasData = document.getElementById("canvas-area");
$(function () {
    var outputImg = document.createElement('img');
    //印刷ボタンをクリックした時の処理
    $('.print-btn').on('click', function () {
        var data = canvasData.toDataURL();
        outputImg.src = data;
        $('.print-area').append(outputImg);
        $('.warrp').addClass('print');
        $('.print-area').addClass('print');
        $('body > :not(.print)').addClass('print-off');
        print();
    });

    function print() {
        window.print();
        $('print').removeClass('print');
        $('.print-off').removeClass('print-off');
        outputImg.remove();
    }
});