import {
  activeLayer,
  canvasSetSize,
  flipCanvas,
  applyEffect,
} from '../canvas.js';

export const updateImage = () => {
  const {
    id,
    content,
    opacity,
    fileName,
    strokeColor,
    strokeSize,
    shadowColor,
    shadowBlurSize,
    shadowOffsetX,
    shadowOffsetY,
  } = activeLayer;

  const container = document.getElementById(id);
  const img = container.firstChild;

  img.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlurSize}px ${shadowColor}) opacity(${opacity})`;
  img.style.outline = `solid ${strokeSize}px ${strokeColor}`;
};

export const drawImage = () => {
  const {
    id,
    content,
    imgWidth,
    imgHeight,
    opacity,
    fileName,
    strokeSize,
    shadowBlurSize,
    shadowOffsetX,
    shadowOffsetY,
  } = activeLayer;
  var canvas = document.getElementById(id);
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const effectsAddWidth =
    parseInt(strokeSize) * 2 +
    parseInt(shadowBlurSize) * 2 +
    parseInt(shadowOffsetX) * 2;
  const effectsAddHeight =
    parseInt(strokeSize) * 2 +
    parseInt(shadowBlurSize) * 2 +
    parseInt(shadowOffsetY) * 2;

  const cWidth = Math.round(imgWidth + effectsAddWidth);
  const cHeight = Math.round(imgHeight + effectsAddHeight);

  canvasSetSize(cWidth, cHeight);
  //Flip Canvas if Needed
  flipCanvas();
  ctx.globalAlpha = opacity;
  //Apply Effects if exist
  applyEffect();

  if (fileName.includes('jpg')) {
    //fix for chrome for not showing shadow for JPG
    ctx.fillStyle = 'White';
    ctx.fillRect(
      effectsAddWidth / 2,
      effectsAddHeight / 2,
      imgWidth,
      imgHeight
    );
  }

  //Draw Stroke for Image
  if (activeLayer.strokeSize != 0) {
    ctx.strokeStyle = activeLayer.strokeColor;
    ctx.lineWidth = activeLayer.strokeSize;
    ctx.strokeRect(
      effectsAddWidth / 2 - strokeSize / 2,
      effectsAddHeight / 2 - strokeSize / 2,
      strokeSize / 2 + imgWidth + strokeSize / 2,
      strokeSize / 2 + imgHeight + strokeSize / 2
    );
  }

  //Draw the actual Image
  ctx.drawImage(
    content,
    effectsAddWidth / 2,
    effectsAddHeight / 2,
    imgWidth,
    imgHeight
  );
  ctx.imageSmoothingEnabled = false;

  //Reset Upload File Input Value
  document.getElementById('imageUpload').value = '';
};

export const resizeImage = () => {
  const {
    strokeSize,
    shadowBlurSize,
    shadowOffsetX,
    id,
    imgRatio,
  } = activeLayer;

  const effectsAddWidth =
    parseInt(strokeSize) * 2 +
    parseInt(shadowBlurSize) * 2 +
    parseInt(shadowOffsetX) * 2;

  const imgWidth =
    //parseInt($('#canvasDiv' + id).css('width'))
    parseInt(document.getElementById(id).parentElement.style.width) -
    effectsAddWidth;
  const imgHeight = Math.round(imgWidth / imgRatio);
  if (imgHeight > 20) {
    activeLayer.imgWidth = imgWidth;
    activeLayer.imgHeight = imgHeight;

    drawImage(false);
  }
};
