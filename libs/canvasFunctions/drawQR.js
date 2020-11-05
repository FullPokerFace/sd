import {
  activeLayer,
  canvasSetSize,
  flipCanvas,
  applyEffect,
} from '../canvas.js';

export const drawQR = () => {
  const {
    id,
    content,
    qrSize,
    color,
    opacity,
    strokeSize,
    shadowBlurSize,
    shadowOffsetX,
    shadowOffsetY,
    strokeColor,
  } = activeLayer;

  const effectsAddWidth =
    parseInt(strokeSize) * 2 +
    parseInt(shadowBlurSize) * 2 +
    parseInt(shadowOffsetX) * 2;
  const effectsAddHeight =
    parseInt(strokeSize) * 2 +
    parseInt(shadowBlurSize) * 2 +
    parseInt(shadowOffsetY) * 2;

  const cWidth = Math.round(qrSize + effectsAddWidth);
  const cHeight = Math.round(qrSize + effectsAddHeight);

  canvasSetSize(cWidth, cHeight);

  //Generate QR Code
  var qrCanvas = kjua({
    text: content,
    render: 'canvas',
    size: qrSize,
    background: null,
    fill: color,
  });
  var ctx = document.getElementById(id).getContext('2d');

  //Flip Canvas if Needed
  flipCanvas();
  ctx.globalAlpha = opacity;
  //Apply Effects if exist
  applyEffect();

  //Draw the actual QR Code
  ctx.drawImage(
    qrCanvas,
    effectsAddWidth / 2,
    effectsAddHeight / 2,
    qrSize,
    qrSize
  );
  //Draw Stroke for QR Code
  if (strokeSize != 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    ctx.strokeRect(
      effectsAddWidth / 2 - strokeSize / 2,
      effectsAddHeight / 2 - strokeSize / 2,
      strokeSize / 2 + qrSize + strokeSize / 2,
      strokeSize / 2 + qrSize + strokeSize / 2
    );
  }
};

export const updateQR = () => {
  const {
    id,
    content,
    opacity,
    fileName,
    color,
    strokeColor,
    strokeSize,
    shadowColor,
    shadowBlurSize,
    shadowOffsetX,
    shadowOffsetY,
  } = activeLayer;

  const container = document.getElementById(id);
  const svg = container.firstChild;

  const qr = kjua({
    text: content,
    render: 'svg',
    size: 300,
    background: null,
    fill: color,
  });

  svg.innerHTML = qr.innerHTML;

  svg.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlurSize}px ${shadowColor}) opacity(${opacity})`;
  svg.style.outline = `solid ${strokeSize}px ${strokeColor}`;
};

//----------------------
/////Resize QR-Code
//----------------------
export const resizeQR = () => {
  activeLayer.qrSize = parseInt(
    document.getElementById(activeLayer.id).parentElement.style.width
  ); //parseInt($('#canvasDiv' + activeLayer.id).css('width'));
  drawQR(false);
};
