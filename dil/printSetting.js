
const canvasData = document.getElementById("canvas-area");
// function closePrint () {
//     document.body.removeChild(this.__container__);
//   }
  
//   function setPrint () {
//     this.contentWindow.__container__ = this;
//     this.contentWindow.onbeforeunload = closePrint;
//     this.contentWindow.onafterprint = closePrint;
//     this.contentWindow.focus(); // Required for IE
//     this.contentWindow.print();
//   }
  
//   function printPage (sURL) {
//     var oHiddFrame = document.createElement("iframe");
//     oHiddFrame.onload = setPrint;
//     oHiddFrame.style.position = "fixed";
//     oHiddFrame.style.right = "0";
//     oHiddFrame.style.bottom = "0";
//     oHiddFrame.style.width = "0";
//     oHiddFrame.style.height = "0";
//     oHiddFrame.style.border = "0";
//     oHiddFrame.src = sURL;
//     document.body.appendChild(oHiddFrame);
//   }




$(function () {
    var outputImg = document.createElement('img');
    //印刷ボタンをクリックした時の処理
    $('.print-btn').on('click', function () {
        var data = canvasData.toDataURL();
        outputImg.src = data;
        $('.print-area').append(outputImg);

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