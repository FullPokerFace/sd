import {
  activeLayer,
  canvasSetSize,
  flipCanvas,
  applyEffect,
  setHeightBeforeResize,
  saveToHistory,
} from '../canvas.js';
import { moveable } from '../../modules/Init.js';

export const drawText = () => {
  // Get Layer Properties
  const {
    id,
    content,
    fontFamily,
    fontSize,
    color,
    lineHeight,
    strokeSize,
    opacity,
    strokeColor,
    fontOptions,
    shadowBlurSize,
    shadowOffsetX,
    shadowOffsetY,
  } = activeLayer;

  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');

  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let canvasWidth = 0;
  let canvasHeight = 0;
  let textWidth = 0;
  let textHeight = 0;
  let textTopOffsets = [];
  let leftOffset = 0;

  // Determine the font style - Normal, Bold, Italic
  let fontStyle = 'Normal';
  if (fontOptions.toString().includes('italic')) fontStyle += ' Italic';
  if (fontOptions.toString().includes('bold')) fontStyle += ' Bold';

  // Split text in lines if multiline
  const textLines = content.split('\n');

  // Apply fontFamily & Size
  ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  const effectsAddWidth = parseInt(strokeSize) + parseInt(shadowBlurSize) * 2;
  const effectsAddHeight = parseInt(strokeSize) + parseInt(shadowBlurSize) * 2;

  // CALCULATE CANVAS WIDTH & HEIGHT BASED ON TEXT

  // Calculate the canvas width and height to resize canvas
  textLines.forEach((line, index) => {
    let textMsr = ctx.measureText(line);

    // Calculate Text Width to find the longest in px
    const tWidth =
      textMsr.actualBoundingBoxLeft + textMsr.actualBoundingBoxRight;

    canvasWidth = tWidth > canvasWidth ? tWidth : canvasWidth;
    canvasWidth = Math.round(canvasWidth);
    //--------------------

    // Calculate text height by using all characters of the font
    textMsr = ctx.measureText(
      'The quick brown fox jumps over the lazy dog 1234567890!@#$%^&*(*)_'
    );

    textHeight =
      textMsr.actualBoundingBoxAscent + textMsr.actualBoundingBoxDescent;
    //--------------------

    // Save top offset for each line using text height size
    textTopOffsets.push(
      Math.round(
        textMsr.actualBoundingBoxAscent +
          textHeight * index * lineHeight +
          effectsAddHeight / 2
      )
    );

    // Canvas height is the last element top baseline plus height
    canvasHeight = textHeight * index * lineHeight + textHeight;
  });

  // Add Stroke & Shadow Effect size to canvas and left offset
  canvasWidth += effectsAddWidth + parseInt(shadowOffsetX);
  canvasHeight += effectsAddHeight + parseInt(shadowOffsetY);

  //----------------------------------------------

  // Set new sizes for canvas
  canvasSetSize(canvasWidth, canvasHeight);

  // Flip Canvas if Needed
  flipCanvas();
  // Apply Effects if exist
  applyEffect();

  // Apply all text settings
  ctx.lineWidth = strokeSize;
  ctx.globalAlpha = opacity;
  ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  if (color === '#none') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  } else {
    ctx.fillStyle = color;
  }
  ctx.lineJoin = 'round';
  ctx.strokeStyle = strokeColor;

  //----------------------------------------------

  // DRAWING TEXT

  textLines.forEach((line, index) => {
    const textMeasurements = ctx.measureText(line);

    // text Align Options
    if (fontOptions.toString().includes('centerAlign')) {
      leftOffset =
        canvasWidth / 2 -
        Math.round(
          textMeasurements.actualBoundingBoxLeft +
            textMeasurements.actualBoundingBoxRight
        ) /
          2 +
        Math.round(textMeasurements.actualBoundingBoxLeft);
    } else if (fontOptions.toString().includes('rightAlign')) {
      leftOffset =
        canvasWidth -
        Math.abs(textMeasurements.actualBoundingBoxRight) -
        effectsAddWidth / 2;
      leftOffset;
    } else {
      leftOffset = textMeasurements.actualBoundingBoxLeft + effectsAddWidth / 2;
    }
    //----------------------------------------------

    // Draw Text Stroke
    if (strokeSize != 0) {
      ctx.strokeText(line, leftOffset, textTopOffsets[index]);
    }

    // Draw Text Fill

    ctx.fillText(line, leftOffset, textTopOffsets[index]);

    // CROSSLINE & UNDERLINE

    // Get text line width

    textWidth =
      textMeasurements.actualBoundingBoxLeft +
      textMeasurements.actualBoundingBoxRight;

    //Draw Guide Rectangles
    // ctx.strokeRect(
    //   leftOffset - textMeasurements.actualBoundingBoxLeft,
    //   textTopOffsets[index] - textMeasurements.actualBoundingBoxAscent,
    //   textWidth,
    //   textHeight
    // );

    // CrossLine Option
    if (fontOptions.toString().includes('crossline')) {
      if (strokeSize != 0) {
        ctx.strokeRect(
          leftOffset - textMeasurements.actualBoundingBoxLeft,
          textHeight / 2 +
            textHeight * lineHeight * index +
            effectsAddHeight / 2,
          textWidth,
          Math.round(fontSize * 0.05)
        );
      }
      ctx.fillRect(
        leftOffset - textMeasurements.actualBoundingBoxLeft,
        textHeight / 2 + textHeight * lineHeight * index + effectsAddHeight / 2,
        textWidth,
        Math.round(fontSize * 0.05)
      );
    }
    //

    // Underline Option
    if (fontOptions.toString().includes('underline')) {
      if (strokeSize != 0) {
        ctx.strokeRect(
          leftOffset - textMeasurements.actualBoundingBoxLeft,
          textHeight * 0.85 +
            textHeight * lineHeight * index +
            effectsAddHeight / 2,
          textWidth,
          Math.round(fontSize * 0.05)
        );
      }
      ctx.fillRect(
        leftOffset - textMeasurements.actualBoundingBoxLeft,
        textHeight * 0.85 +
          textHeight * lineHeight * index +
          effectsAddHeight / 2,
        textWidth,
        Math.round(fontSize * 0.05)
      );
    }
    //
  });

  setHeightBeforeResize(canvasWidth, canvasHeight);
};

export const updateText = () => {
  const {
    id,
    content,
    lineHeight,
    imgWidth,
    imgHeight,
    addWidth,
    addHeight,
    fontSize,
    color,
    fontOptions,
    fontFamily,
    strokeSize,
    strokeColor,
    shadowBlurSize,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    opacity,
  } = activeLayer;

  const container = document.getElementById(id);
  const editable = container.childNodes[0];

  if (color != '#none') {
    editable.style.color = color;
  } else {
  }

  if (editable.innerText != content) {
    editable.innerText = content;
  }

  editable.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlurSize}px ${shadowColor}) opacity(${opacity})`;
  editable.style.lineHeight = lineHeight;
  editable.style.webkitTextStroke = `${strokeSize / 10}px ${strokeColor}`;
  editable.style.fontFamily = fontFamily;
  editable.style.fontSize = `${fontSize}px`;
  editable.style.textAlign = fontOptions[fontOptions.length - 1];

  editable.style.fontWeight = fontOptions.join(' ').includes('bold')
    ? 'bold'
    : '';
  editable.style.fontStyle = fontOptions.join(' ').includes('italic')
    ? 'italic'
    : '';

  let textDecoration = '';
  textDecoration += fontOptions.join(' ').includes('line-through')
    ? 'line-through'
    : '';
  textDecoration += fontOptions.join(' ').includes('underline')
    ? ' underline'
    : '';

  editable.style.textDecoration = textDecoration;
  // moveable.target = null;
  // moveable.target = document.getElementById(id);

  //const outlineDiv = container.querySelector('.editable-outline');

  //outlineDiv.style = editable.style.cssText;

  //outlineDiv.textContent = editable.textContent = content;
  //outlineDiv.style.lineHeight = editable.style.lineHeight = lineHeight;
  //outlineDiv.style.webkitTextStroke = `${strokeSize}px ${strokeColor}`;
};
