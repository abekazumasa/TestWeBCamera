$(function(){
    //印刷ボタンをクリックした時の処理
    $('.print-btn').on('click', function(){
    
    //プリントしたいエリアの取得
    var printArea = document.getElementsByClassName("print-area");
    
    //プリント用の要素「#print」を作成し、上で取得したprintAreaをその子要素に入れる。
    $('body').append('<div id="print" class="printBc"></div>');
    $(printArea).clone().appendTo('#print');
    
    $('body > :not(#print)').addClass('print-off');
    window.print();
    $('#print').remove();
$('.print-off').removeClass('print-off');
     });
    });