import {
  activeLayer,
  canvasSetSize,
  flipCanvas,
  applyEffect,
} from '../canvas.js';

export const updateShape = () => {
  const {
    id,
    content,
    imgWidth,
    imgHeight,
    addWidth,
    addHeight,
    color,
    strokeSize,
    strokeColor,
    shadowBlurSize,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    opacity,
  } = activeLayer;

  const container = document.getElementById(id);
  const svg = container.firstChild;
  let style = '';

  svg.getElementsByTagName('*').forEach((el) => {
    if (color === '#none') {
      style = el.getAttribute('data-orig-color');
    } else {
      style = `fill: ${color};`;
    }
    style += ` stroke: ${strokeColor};
    stroke-width: ${strokeSize}px`;

    el.style = style;
  });

  svg.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlurSize}px ${shadowColor}) opacity(${opacity})`;
};
