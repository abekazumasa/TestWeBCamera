import interact from 'interactjs'

class InteractCanvas {
  constructor(){
    this.file        = document.getElementById('image_file');

    //リサイズフラグ
    this.resizeFlag  = true;
    this.resizeTimer = null;

    this.createCanvasContext();
    this.bind();
  }

  //イベントはここにまとめる
  bind(){
    //ファイルアップロードを検知
    this.file.addEventListener('change', (e) => {
      this.loadImage(e);
    }, false);

    //描画した画像のマウスオン処理
    this.canvas.addEventListener('mousemove', (e) => {
      this.addDraggableCursor(e);
    }, false);

    //画面リサイズ
    window.addEventListener( 'resize', () => {
      if(this.resizeFlag){
        this.resizeFlag = false;
        if(this.resizeTimer){
          window.cancelAnimationFrame(this.resizeTimer);
        }
        this.resizeTimer = window.requestAnimationFrame(() => {
          //ここにリサイズ時の処理を書く
          this.drawResizeImage();
          this.resizeFlag = true;
        });
      }
    }, false );

  }

  //canvasの描画機能を有効化
  createCanvasContext() {
    this.canvas = document.getElementById('canvas-area');
    this.canvas.width  = this.canvas.clientWidth* window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight* window.devicePixelRatio;
    this.ctx           = this.canvas.getContext('2d');
    this.isDrawed      = false;
  }

  //画像を読み込む
  loadImage(e) {
    if(!e.target.files[0]){
      return;
    }
    const file = e.target.files[0];
    //画像以外のファイルは無効
    if(!file.type.match("image.*")){
      alert('画像をアップロードしてください');
      return;
    }
    //FileオブジェクトからURLを生成
    const urlObj = window.URL || window.webkitURL;
    const url     = urlObj.createObjectURL(file);
    //canvasに描画
    this.drawCanvas(url);
  }

  /*
  * canvasに描画する
  * @param {String} 画像url
  */
  drawCanvas(url) {
    if(!url){
      return;
    }
    this.img        = new Image();
    this.img.src    = url;
    this.img.onload = () => {
      //画像をcanvasの中心に描画
      this.drawImageCenter();
      //interact.jsを適用
      this.applyInteractJs();
    }
  }

  //canvasの中心に描画する
  drawImageCenter(){
    //幅・高さの上限
    const maxW  = this.canvas.width;
    const maxH  = this.canvas.height;
    //描画する画像の幅もしくは高さが上限を超える場合
    if(
      this.img.width >= maxW ||this.img.height >= maxH)
    {
      //高さの上限に合わせる
      this.drawHeight = maxH;
      this.drawWidth  = this.drawHeight * (this.img.width / this.img.height);
      //はみ出す場合は幅の上限に合わせる
      if(this.drawWidth >= maxW){
        this.drawWidth  = maxW;
        this.drawHeight = this.drawWidth * (this.img.height / this.img.width);
      }
    }
    //それ以外はそのままのサイズで表示
    else {
      this.drawWidth  = this.img.width;
      this.drawHeight = this.img.height;
    }

    
    //位置をcanvasの中心にする
    this.position = {
      x : this.canvas.width / 2 - this.drawWidth / 2,
      y : this.canvas.height / 2 - this.drawHeight / 2
    };

    //canvasをクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.drawWidth,
      this.drawHeight
      );
    this.isDrawed = true;
  }

  //interact.jsを適用
  applyInteractJs(){
    this.cursor   = null;
    this.html     = document.documentElement;
    this.addDraggingEvent();
  }

  //ドラッグイベントを適用
  addDraggingEvent(){
    if(this.interact){
      this.interact.unset();
      this.interact = null;
    }
    this.interact = interact('#canvas-area')
    .draggable({
      inertia     : false,
      onstart     : (e) => {
        this.dragStartListener(e);
      },
      onmove      : (e) => {
        this.dragMoveListener(e);
      },
      onend       : (e) => {
        this.dragEndListener(e);
      },
      cursorChecker: (action, interactable, element, interacting) => {
        if(this.cursor){
          return interacting ? 'grabbing' : this.cursor;
        }
        else {
          return interacting ? 'grabbing' : null;
        }
      }
    });
  }

  /*
  * dragstartイベントを取得
  * @param {Object} e
  */
  dragStartListener(e) {
    this.isDrag = false;

    //画像のフォーカス判定
    const isFocusImageOnCanvas = this.isFocusImageOnCanvas(e);
    if(isFocusImageOnCanvas){
      //ドラッグ中フラグを立てる
      this.isDrag = true;
    }
  }

  /*
  * dragmoveイベントを取得
  * @param {Object} e
  */
  dragMoveListener(e){

    if(!this.isDrag){
      if(this.html.classList.contains('is-dragging')){
        this.html.classList.remove('is-dragging');
      }
      return;
    }
    if(!this.html.classList.contains('is-dragging')){
      this.html.classList.add('is-dragging');
    }

    //位置情報を計算
    this.position.x = this.position.x + (e.dx * window.devicePixelRatio);
    this.position.y = this.position.y + (e.dy * window.devicePixelRatio);

    //canvasをクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //移動した値で描画
    this.ctx.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.drawWidth,
      this.drawHeight
      );
  }

  /*
  * dragendイベントを取得
  * @param {Object} e
  */
  dragEndListener(e){
    if(this.html.classList.contains('is-dragging')){
      this.html.classList.remove('is-dragging');
    }
  }

  /*
  * ドラッグ時のカーソルを調整
  * @param {Object} e マウスオンイベント
  */
  addDraggableCursor(e){
    //すでに描画されている場合のみ
    if(!this.isDrawed){
      return;
    }
    //画像のフォーカス判定
    const isFocusImageOnCanvas = this.isFocusImageOnCanvas(e);
    if(isFocusImageOnCanvas){
      this.cursor = 'grab';
    }
    else {
      this.cursor = null;
    }
  }

  //canvas上で画像をフォーカスしているかどうか
  isFocusImageOnCanvas(e){
    const x = e.clientX * window.devicePixelRatio;
    const y = e.clientY * window.devicePixelRatio;

    return (
      x >= this.position.x &&
      x <= this.position.x + this.drawWidth &&
      y >= this.position.y &&
      y <= this.position.y + this.drawHeight+this.drawHeight
      );
  }

  //リサイズ時に再描画する
  drawResizeImage(){
    //すでに描画されている場合のみ
    if(!this.isDrawed){
      return;
    }
    //canvasを再取得
    this.createCanvasContext();
    //描画
    this.drawImageCenter();
    //interact.js再設定
    this.applyInteractJs();
  }
}
new InteractCanvas();
