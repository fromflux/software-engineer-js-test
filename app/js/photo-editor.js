export default class PhotoEditor {
  constructor(containerSelector) {
    this.containerSelector = containerSelector;
    this.containerEl = document.querySelector(containerSelector) || null;

    if (!this.containerEl) {
      throw new Error(`Failed to find element ${containerSelector}`);
    }

    this.containerEl.innerHTML = `
      <canvas id="editor-canvas"></canvas>
        
      <button id="upBtn">UP</button>
      <button id="downBtn">DOWN</button>
      <button id="leftBtn">LEFT</button>
      <button id="rightBtn">RIGHT</button>

      <button id="zoomInBtn">ZOOM IN</button>
      <button id="zoomOutBtn">ZOOM OUT</button>
    `;

    this.SCREEN_FACTOR = 40;

    this.CANVAS_WIDTH = 15 * this.SCREEN_FACTOR;
    this.CANVAS_HEIGHT = 10 * this.SCREEN_FACTOR;

    this.canvasEl = document.getElementById("editor-canvas");

    this.canvasEl.width = this.CANVAS_WIDTH;
    this.canvasEl.height = this.CANVAS_HEIGHT;
    this.canvasRatio = this.CANVAS_WIDTH / this.CANVAS_HEIGHT;

    this.inputImage = null;

    this.imgWidth = 0;
    this.imgHeight = 0;
    this.imgRatio = 0;

    this.xOffset = 0;
    this.yOffset = 0;

    this.minScale = 0;
    this.currentScale = 0;

    // --- BUTTONS ---

    this.leftBtn = document.getElementById("leftBtn");
    this.leftBtn.addEventListener('click', () => {
      const delta = 10;
      this.translateImage(-delta, 0)
    });

    this.rightBtn = document.getElementById("rightBtn");
    this.rightBtn.addEventListener('click', () => {
      const delta = 10;
      this.translateImage(delta, 0)
    });

    this.upBtn = document.getElementById("upBtn");
    this.upBtn.addEventListener('click', () => {
      const delta = 10;
      this.translateImage(0, -delta);
    });

    this.downBtn = document.getElementById("downBtn");
    this.downBtn.addEventListener('click', () => {
      const delta = 10;
      this.translateImage(0, delta);
    });

    // ---

    this.zoomInBtn = document.getElementById("zoomInBtn");
    this.zoomInBtn.addEventListener('click', () => {
      const deltaScale = 0.1;
      this.scaleImage(deltaScale);
    });

    this.zoomOutBtn = document.getElementById("zoomOutBtn");
    this.zoomOutBtn.addEventListener('click', () => {
      const deltaScale = -0.1;
      this.scaleImage(deltaScale);
    });
  }

  translateImage(deltaX, deltaY) {
    if (this.inputImage) {

      if (deltaX < 0) {
        if (Math.abs(this.xOffset + deltaX) <= Math.floor(this.imgWidth * this.currentScale) - this.CANVAS_WIDTH) {
          this.xOffset += deltaX;
        } else {
          this.xOffset = -(Math.floor(this.imgWidth * this.currentScale) - this.CANVAS_WIDTH);
        }
      }

      if (deltaX > 0) {
        if (this.xOffset + deltaX <= 0) {
          this.xOffset += deltaX;
        } else {
          this.xOffset = 0;
        }
      }

      if (deltaY < 0) {
        if (Math.abs(this.yOffset + deltaY) <= Math.floor(this.imgHeight * this.currentScale) - this.CANVAS_HEIGHT) {
          this.yOffset += deltaY;
        } else {
          this.yOffset = -(Math.floor(this.imgHeight * this.currentScale) - this.CANVAS_HEIGHT);
        }
      }

      if (deltaY > 0) {
        if (this.yOffset + deltaY <= 0) {
          this.yOffset += deltaY;
        } else {
          this.yOffset = 0;
        }
      }

      this.render();

    }
  }

  scaleImage(deltaScale) {
    if (this.inputImage) {
      if (this.currentScale + deltaScale > this.minScale) {
        this.currentScale += deltaScale;
      } else {
        this.currentScale = this.minScale;
      }

      if (Math.abs(this.xOffset) > Math.floor(this.imgWidth * this.currentScale) - this.CANVAS_WIDTH) {
        this.xOffset = -(Math.floor(this.imgWidth * this.currentScale) - this.CANVAS_WIDTH);
      }

      if (Math.abs(this.yOffset) > Math.floor(this.imgHeight * this.currentScale) - this.CANVAS_HEIGHT) {
        this.yOffset = -(Math.floor(this.imgHeight * this.currentScale) - this.CANVAS_HEIGHT);
      }

      this.render();
    }
  }

  loadImage(img) {
    this.inputImage = img;

    this.imgWidth = img.naturalWidth;
    this.imgHeight = img.naturalHeight;

    this.imgRatio = this.imgWidth / this.imgHeight;

    if (this.imgRatio > this.canvasRatio) {
      this.minScale = this.canvasEl.height / this.imgHeight;
    } else {
      this.minScale = this.canvasEl.width / this.imgWidth;
    }

    this.currentScale = this.minScale;

    this.xOffset = 0;
    this.yOffset = 0;

    this.render();
  }

  getState() {
    if (this.inputImage) {
      return {
        "canvas": {
          "width": this.CANVAS_WIDTH / this.SCREEN_FACTOR,
          "height": this.CANVAS_HEIGHT / this.SCREEN_FACTOR,
        },
        "image": {
          "data": this.inputImage.src,
          "width": this.imgWidth * this.currentScale / this.SCREEN_FACTOR,
          "height": this.imgHeight * this.currentScale / this.SCREEN_FACTOR,
          "x": this.xOffset / this.SCREEN_FACTOR,
          "y": this.yOffset / this.SCREEN_FACTOR
        }
      }
    }
  }

  loadState(state) {
    this.CANVAS_WIDTH = state.canvas.width * this.SCREEN_FACTOR;
    this.CANVAS_HEIGHT = state.canvas.height * this.SCREEN_FACTOR;

    const image = new Image();
    image.src = state.image.data;

    image.onload = () => {
      this.loadImage(image);

      this.currentScale = (state.image.width / this.imgWidth) * this.SCREEN_FACTOR;

      this.xOffset = state.image.x * this.SCREEN_FACTOR;
      this.yOffset = state.image.y * this.SCREEN_FACTOR;

      this.render();
    }
  }

  render() {
    if (this.inputImage) {
      const ctx = this.canvasEl.getContext('2d');
      ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      ctx.drawImage(
        this.inputImage,
        0, 0, this.imgWidth, this.imgHeight,
        this.xOffset, this.yOffset, Math.floor(this.imgWidth * this.currentScale), Math.floor(this.imgHeight * this.currentScale)
      );
    }
  }
}