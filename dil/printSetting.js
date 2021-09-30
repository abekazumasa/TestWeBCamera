
const canvasData = document.getElementById("canvas-area");



$(function () {
    var outputImg = document.createElement('img');
    //印刷ボタンをクリックした時の処理
    $('.print-btn').on('click', function () {
        var data = canvasData.toDataURL();
        outputImg.src = data;
        $('.print-area').append(outputImg);

        //プリントしたいエリアの取得
        var printarea = document.getElementsByClassName('print-area');
        //プリント用の要素「#print」を作成し、上で取得したprintAreaをその子要素に入れる。
        $('.warrp').addClass('print');
        $(printarea).addClass('print');
        $('body > :not(.print)').addClass('print-off');
        setTimeout(function () {
            print();
        }, 200);

    });
    function print() {

        window.print();
        $('print').removeClass('print');
        $('.print-off').removeClass('print-off');
        outputImg.remove();
    }

});