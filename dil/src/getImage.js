import interact from 'interactjs'

class InteractCanvas {
  constructor() {
    this.file = document.getElementById('image_file');
    this.createCanvasContext();
    this.bind();
  }
  bind() {
    this.file.addEventListener('change', (e) => {
      this.loadImage(e);
    }, false);

    this.canvas.addEventListener('mousemove', (e) => {
      this.addDraggableCursor(e);
    }, false);
  }

  createCanvasContext() {
    this.canvas = document.getElementById('canvas-area');
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawed = false;
  }

  loadImage(e) {
    if (!e.target.files[0]) {
      return;
    }
    const file = e.target.files[0];
    if (!file.type.match("image.*")) {
      alert('画像をアップロードしてください');
      return;
    }
    //FileオブジェクトからURLを生成
    const urlObj = window.URL || window.webkitURL;
    const url = urlObj.createObjectURL(file);
    //canvasに描画
    this.drawCanvas(url);
  }

  drawCanvas(url) {
    if (!url) {
      return;
    }
    this.img = new Image();
    this.img.src = url;
    this.img.onload = () => {
      //画像をcanvasの中心に描画
      this.drawImageCenter();
      //interact.jsを適用
      this.applyInteractJs();
    }
  }
  //interact.jsを適用
  applyInteractJs() {
    //任意のカーソルのスタイル設定用
    this.cursor = null;
    //ドラッグイベントの状態によって<html>タグにclassを付与するため要素を変数にして共通化しておく
    this.html = document.documentElement;
    //ドラッグイベントを適用
    this.addDraggingEvent();
  }
  addDraggingEvent() {
    //interact.jsが適用されている場合は削除して再適用
    if (this.interact) {
      this.interact.unset();
      this.interact = null;
    }

    this.interact = interact('#canvas-area')
      .draggable({
        inertia: true,
        onstart: (e) => {
          this.dragStartListener(e);
        },
        onmove: (e) => {
          this.dragMoveListener(e);
        },
        onend: (e) => {
          this.dragEndListener(e);
        },
        cursorChecker: (action, interactable, element, interacting) => {
          if (this.cursor) {
            return this.cursor;
          }
          else {
            return interacting ? 'grabbing' : null;
          }
        }
      });
  }
  dragStartListener(e) {
    this.isDrag = false;
    //canvasに表示した画像の範囲内にポインタがあるかどうかを判定する
    if(
      e.clientX >= this.position.x &&
      e.clientX <= this.position.x + this.drawWidth &&
      e.clientY >= this.position.y &&
      e.clientY <= this.position.y + this.drawHeight
      )
    {
      //ドラッグ中フラグを立てる
      this.isDrag = true;
    }
  }
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
    this.position.x = this.position.x + e.dx;
    this.position.y = this.position.y + e.dy;

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
  dragEndListener(e){
    if(this.html.classList.contains('is-dragging')){
      this.html.classList.remove('is-dragging');
    }
  }
  addDraggableCursor(e){
    //すでに描画されている場合のみ
    if(!this.isDrawed){
      return;
    }
    //画像が描画されている範囲ないにマウスポインタがある場合
    if(
      e.clientX >= this.position.x &&
      e.clientX <= this.position.x + this.drawWidth &&
      e.clientY >= this.position.y &&
      e.clientY <= this.position.y + this.drawHeight
      )
    {
      //カーソルを変更
      this.cursor = 'grab';
    }
    else {
      this.cursor = null;
    }
  }


  drawImageCenter() {
    //幅・高さの上限
    const limit = 0.8;
    const maxW = this.canvas.width * limit;
    const maxH = this.canvas.height * limit;

    //描画する画像の幅もしくは高さが上限を超える場合
    if (
      this.img.width >= maxW ||
      this.img.height >= maxW
    ) {
      //高さの上限に合わせる
      this.drawHeight = maxH;
      this.drawWidth = this.drawHeight * (this.img.width / this.img.height);
      //はみ出す場合は幅の上限に合わせる
      if (this.drawWidth >= maxW) {
        this.drawWidth = maxW;
        this.drawHeight = this.drawWidth * (this.img.height / this.img.width);
      }
    }
    //それ以外はそのままのサイズで表示
    else {
      this.drawWidth = this.img.width;
      this.drawHeight = this.img.height;
    }

    //位置をcanvasの中心にする
    this.position = {
      x: this.canvas.width / 2 - this.drawWidth / 2,
      y: this.canvas.height / 2 - this.drawHeight / 2
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

    //描画済みフラグをたてる
    this.isDrawed = true;
  }


}
new InteractCanvas();
