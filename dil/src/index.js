import interact from 'interactjs'

const dorag = interact('#canvas-area');
var gestureArea = document.getElementsByClassName('main-canvas');
var scaleElement = document.getElementById('canvas-area');
var resetTimeout=1000;
var angleScale = {
  angle: 0,
  scale: 1
}

dorag.resizable({
  // resize from all edges and corners
  edges: { left: true, right: true, bottom: true, top: true },

  listeners: {
    move (event) {
      var target = event.target
      var x = (parseFloat(target.getAttribute('data-x')) || 0)
      var y = (parseFloat(target.getAttribute('data-y')) || 0)

      // update the element's style
      target.style.width = event.rect.width + 'px'
      target.style.height = event.rect.height + 'px'

      // translate when resizing from top or left edges
      x += event.deltaRect.left
      y += event.deltaRect.top

      target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
      target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
    }
  },
  modifiers: [
    // keep the edges inside the parent
    interact.modifiers.restrictEdges({
      outer: '.main-canvas'
    }),

    // minimum size
    interact.modifiers.restrictSize({
      min: { width: 100, height: 50 }
    })
  ],

  inertia: true
})
.draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: '.main-canvas',
      endOnly: true
    })
  ],
  // enable autoScroll
  autoScroll: true,

  listeners: {
    // call this function on every dragmove event
    move: dragMoveListener,

    // call this function on every dragend event
    end (event) {
      var textEl = event.target.querySelector('p')

      textEl && (textEl.textContent =
        'moved a distance of ' +
        (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                   Math.pow(event.pageY - event.y0, 2) | 0))
          .toFixed(2) + 'px')
    }
  }
})
interact(gestureArea)
  .gesturable({
    listeners: {
      start (event) {
        angleScale.angle -= event.angle

        clearTimeout(resetTimeout)
        scaleElement.classList.remove('reset')
      },
      move (event) {
        // document.body.appendChild(new Text(event.scale))
        var currentAngle = event.angle + angleScale.angle
        var currentScale = event.scale * angleScale.scale

        scaleElement.style.transform =
          'rotate(' + currentAngle + 'deg)' + 'scale(' + currentScale + ')'

        // uses the dragMoveListener from the draggable demo above
        dragMoveListener(event)
      },
      end (event) {
        angleScale.angle = angleScale.angle + event.angle
        angleScale.scale = angleScale.scale * event.scale

        resetTimeout = setTimeout(reset, 1000)
        scaleElement.classList.add('reset')
      }
    }
  })
  .draggable({
    listeners: { move: dragMoveListener }
  })

function reset () {
  scaleElement.style.transform = 'scale(1)'

  angleScale.angle = 0
  angleScale.scale = 1
}

function dragMoveListener (event) {
var target = event.target
// keep the dragged position in the data-x/data-y attributes
var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

// translate the element
target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

// update the posiion attributes
target.setAttribute('data-x', x)
target.setAttribute('data-y', y)
}


class InteractCanvas {
  constructor() {
    this.file = document.getElementById('image_file');

    //リサイズフラグ
    this.resizeFlag = true;
    this.resizeTimer = null;

    this.createCanvasContext();
    this.bind();
  }

  //イベントはここにまとめる
  bind() {
    //ファイルアップロードを検知
    this.file.addEventListener('change', (e) => {
      this.loadImage(e);
    }, false);
  }



  //canvasの描画機能を有効化
  createCanvasContext() {
    this.canvas = document.getElementById('canvas-area');
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawed = false;
  }

  //画像を読み込む
  loadImage(e) {
    if (!e.target.files[0]) {
      return;
    }
    const file = e.target.files[0];
    //画像以外のファイルは無効
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

  /*
  * canvasに描画する
  * @param {String} 画像url
  */
  drawCanvas(url) {
    if (!url) {
      return;
    }
    this.img = new Image();
    this.img.src = url;
    this.img.onload = () => {
      //画像をcanvasの中心に描画
      this.drawImageCenter();
    }
  }
  //canvasの中心に描画する
  drawImageCenter() {
    //幅・高さの上限
    const maxW = this.canvas.width;
    const maxH = this.canvas.height;
    //描画する画像の幅もしくは高さが上限を超える場合
    if (this.img.width >= maxW || this.img.height >= maxH) {
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
    this.canvas.width = this.drawWidth;
    this.canvas.height = this.drawHeight;

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
    this.isDrawed = true;
    }

}
new InteractCanvas();


