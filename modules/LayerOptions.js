import { closeDialogues } from '../ui-interactions.js';
import { rgb2hex } from '../libs/rgbToHex.js';
import { getInitOptions } from '../modules/Init.js';

import {
  activeLayer,
  moveLayerTo,
  canvasSetSize,
  drawCanvas,
  applyChangesToLayer,
  resizeText,
  makeActive,
  unselectAllLayers,
} from '../libs/canvas.js';

export const strokeSizeInput = document.getElementById('strokeSizeInput');
export const layerStrokeSizeRange = document.getElementById(
  'layerStrokeSizeRange'
);

export const layerShadowXInput = document.getElementById('layerShadowXInput');
export const layerShadowXRange = document.getElementById('layerShadowXRange');

export const layerShadowYInput = document.getElementById('layerShadowYInput');
export const layerShadowYRange = document.getElementById('layerShadowYRange');

export const layerBlurSizeInput = document.getElementById('layerBlurSizeInput');
export const layerBlurSizeRange = document.getElementById('layerBlurSizeRange');

export const layerOpacityInput = document.getElementById('layerOpacityInput');
export const layerOpacityRange = document.getElementById('layerOpacityRange');

export const layerFontSizeInput = document.getElementById('layerFontSizeInput');
export const layerFontSizeRange = document.getElementById('layerFontSizeRange');

const xPos = document.getElementById('xPos');
const yPos = document.getElementById('yPos');

const textContentInput = document.getElementById('textContentInput');

export let layerList = document.querySelectorAll('.layerList>li');

const layerWidthRange = document.getElementById('layerWidthRange');
const layerWidthInput = document.getElementById('layerWidthInput');
const layerHeightRange = document.getElementById('layerHeightRange');
const layerHeightInput = document.getElementById('layerHeightInput');

const fontOptions = document.querySelectorAll('.fontOptions>li');
const textAlignmentOptions = document.querySelectorAll('.textAlignment');
const fontDecorationOptions = document.querySelectorAll(
  '.fontDecorationOptions'
);

const fontFamilySelect = document.getElementById('fontFamilySelect');

const fontOptionsSection = document.getElementById('fontOptionsSection');
const fillColorSection = document.getElementById('fillColorSection');

export const layerLineHeightSizeInput = document.getElementById(
  'layerLineHeightSizeInput'
);
export const layerLineHeightSizeRange = document.getElementById(
  'layerLineHeightSizeRange'
);

export const fillPickerSwatch = document.getElementById('fillPickerSwatch');
export const fillColorInput = document.getElementById('fillColorInput');
export const layerFillSwatchContainer = document.querySelector(
  '.layerFillSwatchContainer'
);

///

export const strokePickerSwatch = document.getElementById('strokePickerSwatch');
export const strokeColorInput = document.getElementById('strokeColorInput');
export const layerStrokeSwatchContainer = document.querySelector(
  '.layerStrokeSwatchContainer'
);

export const shadowPickerSwatch = document.getElementById('shadowPickerSwatch');
export const shadowColorInput = document.getElementById('shadowColorInput');

export let fillColor = '#419ec7';
export let strokeColor = '#878787';
export let shadowColor = '#666666';
let layerWidth = 100;
let layerHeight = 100;
let strokeSize = 0;
let activeLayerColor = '';

export const displaySwatches = (element, color, array) => {
  const span = document.createElement('span');
  span.classList.add('colorSwatch');

  span.style.backgroundColor = color = `#${color}`;
  if (color === '#none') {
    span.style.backgroundImage = `linear-gradient(to bottom right, white 0%,red 49%,white 52%)`;
    color = '#none';
  }
  span.addEventListener('click', (e) => {
    //closeDialogues();
    setColorToElements(
      color,
      //mainCanvas,
      array[0],
      array[1],
      array[2]
    );

    if (color === '#none' && array[0] === strokePickerSwatch) {
      strokeSizeInput.value = 0;
    }
    updateLayer(true);

    e.stopPropagation();
  });
  element.append(span);
};

fillColorInput.addEventListener('change', () => {
  const color = fillColorInput.value;
  setColorToElements(color, fillPickerSwatch, fillColorInput, fillPicker);
  updateLayer(true);
});
strokeColorInput.addEventListener('change', () => {
  const color = strokeColorInput.value;
  setColorToElements(color, strokePickerSwatch, strokeColorInput, strokePicker);
  updateLayer(true);
});
shadowColorInput.addEventListener('change', () => {
  const color = shadowColorInput.value;
  setColorToElements(color, shadowPickerSwatch, shadowColorInput, shadowPicker);
  updateLayer(true);
});
//------------------------------
//Init Layer Fill Color Picker
//------------------------------
export var fillPicker = new iro.ColorPicker('#fillPicker', {
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
  color: fillColor, // Set the initial color to pure red
  handleRadius: 5,
});

fillPicker.on('color:change', () => {
  setColorToElements(
    fillPicker.color.hexString,
    //mainCanvas,
    fillPickerSwatch,
    fillColorInput,
    fillPicker
  );
  updateLayer();
});

fillPicker.on('input:end', () => {
  updateLayer(true);
});

//------------------------------
//Init Layer Stroke Color Picker
//------------------------------
export var strokePicker = new iro.ColorPicker('#strokePicker', {
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
  color: strokeColor, // Set the initial color to pure red
  handleRadius: 5,
});
export let strokeHex = strokePicker.color.hexString; // Currently selected color

strokePicker.on('color:change', () => {
  setColorToElements(
    strokePicker.color.hexString,
    //mainCanvas,
    strokePickerSwatch,
    strokeColorInput,
    strokePicker
  );
  updateLayer();
});

strokePicker.on('input:end', () => {
  updateLayer(true);
});

//------------------------------
//Init Layer Shadow Color Picker
//------------------------------
export var shadowPicker = new iro.ColorPicker('#shadowPicker', {
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
  color: shadowColor, // Set the initial color to pure red
  handleRadius: 5,
});
export let shadowHex = shadowPicker.color.hexString; // Currently selected color

shadowPicker.on('color:change', () => {
  setColorToElements(
    shadowPicker.color.hexString,
    //mainCanvas,
    shadowPickerSwatch,
    shadowColorInput,
    shadowPicker
  );
  updateLayer();
});

shadowPicker.on('input:end', () => {
  updateLayer(true);
});

export const setColorToElements = (
  color,
  //canvas,
  pickerElement,
  input,
  iroColor
) => {
  if (iroColor === strokePicker) {
    if (strokeSizeInput.value === '0') {
      strokeSizeInput.value = 1;
      layerStrokeSizeRange.value = 1;
    }
  }

  if (color != '#none') {
    //Check if color is a Hex String
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      iroColor.color.hexString = color;
      //mainCanvasColor = iroColor.color.rgbaString;
      const hex = iroColor.color.hexString;
      pickerElement.style.backgroundColor = hex;
      input.value = hex;
    }
  } else {
    input.value = '#none';
    updateLayer(true);
  }
};

//Stroke Size Input & Slider
layerStrokeSizeRange.addEventListener('mousemove', () => {
  if (strokeSizeInput.value != layerStrokeSizeRange.value) {
    strokeSizeInput.value = layerStrokeSizeRange.value;
    updateLayer();
  }
});

strokeSizeInput.addEventListener('click', (e) => {
  closeDialogues();
  layerStrokeSizeRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//    Save To History
layerStrokeSizeRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Shadow Blur Size Input & Slider
layerBlurSizeRange.addEventListener('mousemove', () => {
  if (layerBlurSizeInput.value != layerBlurSizeRange.value) {
    layerBlurSizeInput.value = layerBlurSizeRange.value;
    updateLayer();
  }
});

layerBlurSizeInput.addEventListener('click', (e) => {
  closeDialogues();
  layerBlurSizeRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//    Save To History
layerBlurSizeRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

// Shadow X Y Position

layerShadowXRange.addEventListener('mousemove', () => {
  if (layerShadowXInput.value != layerShadowXRange.value) {
    layerShadowXInput.value = layerShadowXRange.value;
    updateLayer();
  }
});

layerShadowXInput.addEventListener('click', (e) => {
  closeDialogues();
  layerShadowXRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//    Save To History
layerShadowXRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

layerShadowYRange.addEventListener('mousemove', () => {
  if (layerShadowYInput.value != layerShadowYRange.value) {
    layerShadowYInput.value = layerShadowYRange.value;
    updateLayer();
  }
});

layerShadowYInput.addEventListener('click', (e) => {
  closeDialogues();
  layerShadowYRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//    Save To History
layerShadowYRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Font Size Input & Slider
// layerFontSizeRange.addEventListener('mousemove', () => {
//   if (layerFontSizeInput.value != layerFontSizeRange.value) {
//     layerFontSizeInput.value = layerFontSizeRange.value;
//     updateLayer();
//   }
// });

// layerFontSizeInput.addEventListener('click', (e) => {
//   closeDialogues();
//   layerFontSizeRange.parentElement.style.display = 'block';
//   e.stopPropagation();
// });

// //    Save To History
// layerFontSizeRange.addEventListener('mouseup', () => {
//   updateLayer(true);
// });

//Line Height Input & Slider
layerLineHeightSizeRange.addEventListener('mousemove', () => {
  if (layerLineHeightSizeInput.value != layerLineHeightSizeRange.value) {
    layerLineHeightSizeInput.value = layerLineHeightSizeRange.value;
    updateLayer();
  }
});

layerLineHeightSizeInput.addEventListener('click', (e) => {
  closeDialogues();
  layerLineHeightSizeRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//    Save To History
layerLineHeightSizeRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Opacity Input & Slider
layerOpacityRange.addEventListener('mousemove', () => {
  if (layerOpacityInput.value != layerOpacityRange.value) {
    layerOpacityInput.value = layerOpacityRange.value;
    updateLayer();
  }
});

//    Save To History
layerOpacityRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Layer Width Input & Slider

layerWidthRange.addEventListener('mousemove', () => {
  if (layerWidthInput.value != layerWidthRange.value) {
    layerWidthInput.value = layerWidthRange.value;
  }
});

layerWidthInput.addEventListener('click', (e) => {
  closeDialogues();
  layerWidthRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//Layer Height Input & Slider

layerHeightRange.addEventListener('mousemove', () => {
  if (layerHeightInput.value != layerHeightRange.value) {
    layerHeightInput.value = layerHeightRange.value;
  }
});

layerHeightInput.addEventListener('click', (e) => {
  closeDialogues();
  layerHeightRange.parentElement.style.display = 'block';
  e.stopPropagation();
});

//Binding Font Options Buttons

//Binding Font Options Buttons

fontDecorationOptions.forEach((option) => {
  option.addEventListener('click', (event) => {
    event.srcElement.parentElement.classList.toggle('active');
    updateLayer(true);
  });
});

textAlignmentOptions.forEach((option) => {
  option.addEventListener('click', (event) => {
    textAlignmentOptions.forEach((option) => {
      option.classList.remove('active');
    });
    event.srcElement.parentElement.classList.toggle('active');
    updateLayer(true);
  });
});

//////INITIALISATION

layerStrokeSizeRange.value = strokeSizeInput.value = strokeSize;

getInitOptions.then((data) => {
  data.swatchColors.map((color) => {
    displaySwatches(layerFillSwatchContainer, color, [
      fillPickerSwatch,
      fillColorInput,
      fillPicker,
    ]);

    displaySwatches(layerStrokeSwatchContainer, color, [
      strokePickerSwatch,
      strokeColorInput,
      strokePicker,
    ]);
  });
});

setColorToElements(fillColor, fillPickerSwatch, fillColorInput, fillPicker);
setColorToElements(
  strokeColor,
  strokePickerSwatch,
  strokeColorInput,
  strokePicker
);

setColorToElements(
  shadowColor,
  shadowPickerSwatch,
  shadowColorInput,
  shadowPicker
);

//Bind Layer List Elements
export const layerListItemBind = () => {
  layerList = document.querySelectorAll('.layerList>li');
  layerList.forEach((layer) => {
    layer.addEventListener('click', (event) => {
      if (document.querySelector('.activeLayerInLayerList')) {
        document
          .querySelector('.activeLayerInLayerList')
          .classList.remove('activeLayerInLayerList');
      }
      // if a click was on a layer name
      if (event.srcElement.nodeName === 'LI') {
        unselectAllLayers(false);
        // Highlight layer List Item

        event.srcElement.classList.add('activeLayerInLayerList');
        // Make Layer Active

        makeActive(event.srcElement.id.replace(/layerListItem/g, ''), false);
      } else {
        //Otherwise remove it (X - button pressed)
        event.srcElement.parentElement.style.display = 'none';
      }
    });
    layer.addEventListener('mouseover', (event) => {});
  });
};

// X Position Input on Input

xPos.addEventListener('change', (e) => {
  moveLayerTo(xPos.value, yPos.value);
});

yPos.addEventListener('change', (e) => {
  moveLayerTo(xPos.value, yPos.value);
});

textContentInput.addEventListener('keyup', (e) => {
  activeLayer.content = textContentInput.value;
  updateLayer(true);
});

fontFamilySelect.addEventListener('change', () => {
  updateLayer(true);
});

export const updateLayer = (SAVE_TO_HISTORY = false) => {
  try {
    activeLayer.color = fillColorInput.value;
    activeLayer.strokeColor = strokePicker.color.hexString;
    activeLayer.shadowColor = shadowPicker.color.hexString;
    activeLayer.strokeSize = parseFloat(strokeSizeInput.value);
    activeLayer.shadowBlurSize = layerBlurSizeInput.value;
    activeLayer.shadowOffsetX = layerShadowXInput.value;
    activeLayer.shadowOffsetY = layerShadowYInput.value;
    activeLayer.opacity = layerOpacityInput.value / 10;

    // Text & QR Specific Options
    if (
      activeLayer.contentType === 'text' ||
      activeLayer.contentType === 'qr'
    ) {
      textContentInput.value = activeLayer.content;
      // activeLayer.fontSize = parseInt(layerFontSizeInput.value);
      activeLayer.lineHeight = layerLineHeightSizeInput.value;
      activeLayer.fontFamily = fontFamilySelect.selectedOptions[0].label;
      let activeFontOptions = document.querySelectorAll(
        '.fontOptions>li.active'
      );
      activeLayer.fontOptions = [];
      activeFontOptions.forEach((node) => {
        activeLayer.fontOptions.push(`${node.getAttribute('data-property')} `);
      });
      // Change layer list item text
      const content =
        activeLayer.content.length > 20
          ? `${activeLayer.content.substring(0, 20)}...`
          : activeLayer.content;
      const layerListItem = document.getElementById(
        `layerListItem${activeLayer.id}`
      );

      layerListItem.childNodes[0].textContent = content;
      // const replaceText = layerListItem.innerHTML.slice(
      //   0,
      //   layerListItem.innerHTML.indexOf('<span')
      // );
      // console.table(layerListItem.childNodes[0].textContent);

      // const innerHTML = layerListItem.innerHTML.replace(replaceText, content);
      // layerListItem.innerHTML = innerHTML;
      // Change layer label text
      const layerLabel = document.getElementById(`layerLabel`);

      activeLayer.fileName = activeLayer.contentType != 'text' ? content : '';
      layerLabel.innerHTML = activeLayer.fileName;
      //------------------------------------
    }

    applyChangesToLayer(SAVE_TO_HISTORY);
    //drawCanvas(SAVE_TO_HISTORY);
    //makeActive(false);
  } catch (e) {
    console.log(e);
  }
};

export const updateLayerOptionValues = (id) => {
  fontOptionsSection.style.display = 'none';
  fillColorSection.style.display = 'none';

  xPos.value = activeLayer.left;
  yPos.value = activeLayer.top;
  layerWidthRange.value = parseInt(activeLayer.width);
  layerHeightRange.value = parseInt(activeLayer.height);
  strokeSizeInput.value = activeLayer.strokeSize;
  layerStrokeSizeRange.value = activeLayer.strokeSize;
  layerBlurSizeInput.value = activeLayer.shadowBlurSize;
  layerBlurSizeRange.value = activeLayer.shadowBlurSize;
  layerShadowXInput.value = activeLayer.shadowOffsetX;
  layerShadowXRange.value = activeLayer.shadowOffsetX;
  layerShadowYInput.value = activeLayer.shadowOffsetY;
  layerShadowYRange.value = activeLayer.shadowOffsetY;
  layerOpacityInput.value = activeLayer.opacity * 10;
  layerOpacityRange.value = activeLayer.opacity * 10;

  //Text specific Layer Options
  if (activeLayer.contentType === 'text' || activeLayer.contentType === 'qr') {
    textContentInput.value = activeLayer.content;
    //layerFontSizeInput.value = activeLayer.fontSize;
    //layerFontSizeRange.value = activeLayer.fontSize;
    layerLineHeightSizeInput.value = activeLayer.lineHeight;
    layerLineHeightSizeRange.value = activeLayer.lineHeight;

    document.querySelectorAll('#fontFamilySelect>option').forEach((option) => {
      if (option.text === activeLayer.fontFamily) option.selected = 'selected';
    });

    // Clear all active font options DOM to prevent layer getting previous layer settings
    document.querySelectorAll('.fontOptions>li.active').forEach((li) => {
      li.classList.remove('active');
    });

    activeLayer.fontOptions.forEach((option) => {
      document.querySelector(`[data-property=${option}]`).className = 'active';
    });

    layerWidthInput.disabled = true;
    layerWidthInput.value = activeLayer.width;
    layerHeightInput.disabled = true;
    layerHeightInput.value = activeLayer.height;

    fontOptionsSection.style.display = 'block';
    fillColorSection.style.display = 'block';
  }

  //Icon Specific options
  if (activeLayer.contentType === 'shape') {
    fillColorSection.style.display = 'block';

    // TODO create color map for svg image with option to change colors
    // /////////////////

    // $.get(
    //   activeLayer.imgUrl,
    //   (svg) => {
    //     //console.table(svg);

    //     var regex = /fill="/gi,
    //       result,
    //       indices = [];
    //     let modSvgData = '';
    //     while ((result = regex.exec(svg))) {
    //       indices.push(result.index);
    //       console.log(svg.substring(result.index, result.index + 14));
    //       modSvgData = svg.replace(
    //         svg.substring(result.index, result.index + 14),
    //         'fill="#000000"'
    //       );
    //     }
    //     var regex = /000000"/gi,
    //       result,
    //       indices = [];
    //     //console.log(modSvgData);
    //     while ((result = regex.exec(modSvgData))) {
    //       indices.push(result.index);
    //       console.log(svg.substring(result.index, result.index + 14));
    //     }
    //     // let svg1 = document.createElement('div');

    //     // svg1.innerHTML = svg;
    //     // svg1.id = makeId(5);
    //     // container.appendChild(svg1);
    //     // svg1.width = 100;
    //     // svg1.height = 100;
    //     // console.log(
    //     //   svg1.getElementsByTagName('svg')[0].querySelectorAll('path')
    //     //   //[0].outerHTML
    //     // );
    //   },
    //   'text'
    // );

    // ///////////////////
  }

  fillColorInput.value = activeLayer.color;
  strokeColorInput.value = activeLayer.strokeColor;
  shadowColorInput.value = activeLayer.shadowColor;
  // fillColorInput.dispatchEvent(new Event('change'));
  // strokeColorInput.dispatchEvent(new Event('change'));
  // shadowColorInput.dispatchEvent(new Event('change'));
};

export const showHideLayerOptions = (action) => {
  let layerOptions = document.querySelectorAll(
    '.layerOptions > div:not(#layerListContainer)'
  );

  layerOptions.forEach((div) => {
    if (action === 'show') {
      div.classList.remove('hidden');
    } else {
      div.classList.add('hidden');
    }
  });
};

showHideLayerOptions('hide');
