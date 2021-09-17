
const canvasData = document.getElementById("canvas-area");
$(function () {
    //印刷ボタンをクリックした時の処理
    $('.print-btn').on('click', function () {
        var data = canvasData.toDataURL();
        var outputImg = document.createElement('img');
        outputImg.src = data;
       $('.print-area').append(outputImg);

        //プリントしたいエリアの取得
        var printArea = document.getElementsByClassName("print-area");
        //プリント用の要素「#print」を作成し、上で取得したprintAreaをその子要素に入れる。
        $('body').append('<div id="print" class="printBc"></div>');
        $(printArea).clone().appendTo('#print');
        $('body > :not(#print)').addClass('print-off');
        window.print();
        $('#print').remove();
        $('.print-off').removeClass('print-off');
        outputImg.remove();
    });
});