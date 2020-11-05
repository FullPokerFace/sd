import {
  setSize,
  setColor,
  mainCanvasColor,
  bgHex,
  setColorToElements,
  bgColorPicker,
} from './modules/drawingArea.js';

import { displaySwatches } from './modules/LayerOptions.js';
import { makeId } from './libs/makeId.js';

import { getInitOptions, moveable } from './modules/Init.js';
import { layers, CL } from './libs/canvas.js';

import './modules/topMenu.js';

//Tools
import // tabs, tools
'./modules/Tools/ToolsOptions.js';

import { rgb2hex } from './libs/rgbToHex.js';

////Globals
const mainCanvasContainer = document.getElementById('mainCanvasContainer');
export const mainCanvas = document.getElementById('mainCanvas');
export const drawingAreaContainer = document.querySelector(
  '.drawingAreaContainer'
);
export const drawingArea = document.querySelector('.drawingArea');
const canvasWidthInput = document.querySelector('#canvasWidthInput');
const canvasHeightInput = document.querySelector('#canvasHeightInput');
const canvasWidthRange = document.getElementById('canvasWidthRange');
const canvasHeightRange = document.getElementById('canvasHeightRange');
const heightWidthSliders = document.querySelector('.heightWidthSliders');

const colorPickers = document.querySelectorAll('.colorPicker');
export const canvasColorInput = document.getElementById('canvasColorInput');
export const bgFillPickerSwatch = document.getElementById('bgFillPickerSwatch');
const swatchContainer = document.getElementById('swatchContainer');

const dialogueWindows = document.querySelectorAll('.dialogueWindow');

let bgCanvasColor = '#dddddd';

let initOptions = JSON;
getInitOptions.then((data) => {
  initOptions = data;
});

window.onbeforeunload = function (event) {
  const visibleLayers = layers.filter((layer) => layer.isVisible === true);
  if (visibleLayers.length != 0) {
    const backGround = {
      contentType: 'bg',
      bgColor: bgHex,
      bgWidth: mainCanvas.width,
      bgHeight: mainCanvas.height,
      isVisible: true,
    };

    layers.push(backGround);

    layers.sort((a, b) =>
      a.zIndex > b.zIndex ? 1 : b.zIndex > a.zIndex ? -1 : 0
    );

    let layerJSON = JSON.stringify(layers.filter((e) => e.isVisible === true));

    sessionStorage.setItem('recoveredDesign', layerJSON);
  } else {
    sessionStorage.clear();
  }
};

window.onload = () => {
  //
  getInitOptions.then((data) => {
    data.swatchColors.map((color) => {
      displaySwatches(swatchContainer, color, [
        bgFillPickerSwatch,
        canvasColorInput,
        bgColorPicker,
      ]);

      ////
    });
    setSize(
      mainCanvas,
      parseFloat(initOptions.width),
      parseFloat(initOptions.height)
    );

    setColorToElements(
      bgCanvasColor,
      mainCanvas,
      bgFillPickerSwatch,
      canvasColorInput,
      bgColorPicker
    );
  });

  var recoveredDesign = sessionStorage.getItem('recoveredDesign');
  if (recoveredDesign) {
    vex.dialog.confirm({
      message: 'Recover unsaved design?',
      callback: (value) => {
        if (value) {
          const loadedDesign = JSON.parse(recoveredDesign);
          loadedDesign.map((layer) => {
            layer.id = makeId(5);
            if (layer.contentType === 'image') {
              const img = new Image();
              img.src = layer.imgUrl;
              img.onload = () => {};
              layer.content = img;
              CL({}, layer);
            } else if (layer.contentType === 'bg') {
              setSize(mainCanvas, layer.bgWidth, layer.bgHeight);
              setColor(mainCanvas, layer.bgColor);
            } else {
              CL({}, layer);
            }
          });
        }
      },
    });
  }
};

document.body.addEventListener('click', () => {
  closeDialogues();
});

export const closeDialogues = () => {
  dialogueWindows.forEach((window) => {
    window.style.display = 'none';
  });
};
//---------------
//ELEMENT BINDING
//---------------

canvasWidthRange.addEventListener('mousemove', () => {
  canvasWidthInput.value = canvasWidthRange.value;
  document.querySelector('.dialogueWidthLabel').innerHTML =
    canvasWidthRange.value;
  setSize(mainCanvas, canvasWidthInput.value, canvasHeightInput.value);
  setColor(mainCanvas, mainCanvasColor);
});

canvasHeightRange.addEventListener('mousemove', () => {
  canvasHeightInput.value = canvasHeightRange.value;
  document.querySelector('.dialogueHeightLabel').innerHTML =
    canvasHeightRange.value;
  setSize(mainCanvas, canvasWidthInput.value, canvasHeightInput.value);
  setColor(mainCanvas, mainCanvasColor);
});

// canvasWidthRange.addEventListener('wheel', () => {
//   console.log('Scrolled');
// });

// Binding Tab Content Buttons//

//Get All tabs in a list

//Assign On Click for all Tabs

// Binding Tool Buttons

//Dialogue windows
dialogueWindows.forEach((window) => {
  window.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

canvasWidthInput.addEventListener('click', (e) => {
  closeDialogues();
  heightWidthSliders.style.display = 'block';
  e.stopPropagation();
});

canvasHeightInput.addEventListener('click', (e) => {
  closeDialogues();
  heightWidthSliders.style.display = 'block';
  e.stopPropagation();
});

canvasWidthInput.addEventListener('change', () => {
  setSize(mainCanvas, canvasWidthInput.value, canvasHeightInput.value);
  setColor(mainCanvas, mainCanvasColor);
});

canvasHeightInput.addEventListener('change', () => {
  setSize(mainCanvas, canvasWidthInput.value, canvasHeightInput.value);
  setColor(mainCanvas, mainCanvasColor);
});

drawingAreaContainer.addEventListener('wheel', (e) => {
  event.preventDefault();

  scale += event.deltaY * -0.001;

  // Restrict scale
  scale = Math.min(Math.max(0.1, scale), 1.9);

  // Apply scale transform
  drawingAreaContainer.style.transform = `scale(${scale})`;
  const target = moveable.target;
  moveable.target = null;
  moveable.target = target;
});

let scale = 1; //TODO work on the scale UI

//Shows Color Pick Dialogue Window for all rectangle Swatches
colorPickers.forEach((colorPicker) => {
  colorPicker.addEventListener('click', (e) => {
    let dialogueWindow = e.srcElement.parentElement.querySelector(
      '.dialogueWindow'
    );
    if (dialogueWindow) {
      closeDialogues();
      dialogueWindow.style.display = 'block';
    }
    e.stopPropagation();
  });
});

//Canvas Hex Color Input
canvasColorInput.addEventListener('change', () => {
  const color = canvasColorInput.value;
  setColorToElements(
    color,
    mainCanvas,
    bgFillPickerSwatch,
    canvasColorInput,
    bgColorPicker
  );
});
