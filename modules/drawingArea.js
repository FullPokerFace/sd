import { drawingAreaContainer, canvasColorInput } from '../ui-interactions.js';
import { unselectAllLayers } from '../libs/canvas.js';
///Globals
let layers = [];
export let mainCanvasColor = '#3956bf';

const mainCanvasBorder = document.querySelector('.mainCanvasBorder');

//Set Background Color
layers.push({ id: 'mainCanvas', color: mainCanvasColor });

export const setColor = (canvas, color) => {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  mainCanvasColor = color;
  setColorToElements(
    color,
    mainCanvas,
    bgFillPickerSwatch,
    canvasColorInput,
    bgColorPicker
  );
};

export const setSize = (canvas, width, height) => {
  // const box = document
  //   .getElementById('mainCanvasContainer')
  //   .getBoundingClientRect();
  // console.table(box);
  //Force value to be a number or 1
  width = parseFloat(width) || 1;
  height = parseFloat(height) || 1;
  //Force value to be 2000 or less
  width = width > 2000 ? 2000 : width;
  height = height > 2000 ? 2000 : height;

  canvas.parentElement.width = canvas.width = canvasWidthInput.value = canvasWidthRange.value = width;
  canvas.parentElement.height = canvas.height = canvasHeightInput.value = canvasHeightRange.value = height;
  drawingAreaContainer.style.width = `${width}px`;

  //Align Canvas in the center

  let left =
    drawingArea.getBoundingClientRect().width / 2 -
    drawingAreaContainer.getBoundingClientRect().width / 2;
  let top =
    drawingArea.getBoundingClientRect().height / 2 -
    drawingAreaContainer.getBoundingClientRect().height / 2;

  left = left < 0 ? 0 : left;
  top = top < 0 ? 0 : top;

  //drawingAreaContainer.style.left = `${left}px`;
  //drawingAreaContainer.style.top = `${top}px`;

  mainCanvasBorder.style.width = `${width}px`;
  mainCanvasBorder.style.height = `${height}px`;

  //mainCanvasBorder.style.top = `30px`;

  document.querySelector('.dialogueWidthLabel').innerHTML =
    canvasWidthRange.value;
  document.querySelector('.dialogueHeightLabel').innerHTML =
    canvasHeightRange.value;
};

//------------------------------
//Init Background Color Picker
//------------------------------
export var bgColorPicker = new iro.ColorPicker('#bgFillPicker', {
  layout: [
    {
      component: iro.ui.Wheel,
      options: {
        borderColor: '#ffffff',
      },
    },
    {
      component: iro.ui.Slider,
      options: {
        borderColor: '#ffffff',
        sliderType: 'value',
      },
    },
  ],
  borderWidth: 2,
  width: 100, // Set the size of the color picker
  color: mainCanvasColor, // Set the initial color to pure red
  handleRadius: 5,
});
export let bgHex = bgColorPicker.color.hexString; // Currently selected color

bgColorPicker.on('color:change', () => {
  setColorToElements(
    bgColorPicker.color.hexString,
    mainCanvas,
    bgFillPickerSwatch,
    canvasColorInput,
    bgColorPicker
  );
});

export const setColorToElements = (
  color,
  canvas,
  pickerElement,
  input,
  iroColor
) => {
  //Check if color is a Hex String
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    iroColor.color.hexString = color;
    mainCanvasColor = iroColor.color.rgbaString;
    bgHex = iroColor.color.hexString;
    pickerElement.style.backgroundColor = bgHex;
    input.value = bgHex;
    setColor(canvas, mainCanvasColor);
  }
};

const drawingArea = document.querySelector('.drawingArea');

drawingArea.addEventListener('mousedown', (e) => {
  const sourceClass = e.srcElement.className;
  // Unselect layers when clicked on empty space
  if (sourceClass === 'mainCanvas' || sourceClass === 'drawingArea')
    unselectAllLayers();
});
