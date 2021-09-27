
const canvasData = document.getElementById("canvas-area");



$(function () {
    var outputImg = document.createElement('img');
    //印刷ボタンをクリックした時の処理
    $('.print-btn').on('click', function () {
        var data = canvasData.toDataURL();
        outputImg.src = data;
        $('.print-area').append(outputImg);    
        //プリントしたいエリアの取得
        //プリント用の要素「#print」を作成し、上で取得したprintAreaをその子要素に入れる。
        $('body').append('<div id="print" class="printBc"></div>');
        $('.print-area').clone().appendTo('#print');
        $('body > :not(#print)').addClass('print-off');
        setTimeout(function(){
            print();
           
        },100);
        
        
    });
    function print(){

        window.print();
        $('#print').remove();
        $('.print-off').removeClass('print-off');
        outputImg.remove();
    }


});