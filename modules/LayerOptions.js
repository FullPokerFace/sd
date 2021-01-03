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

export const layerStrokeSizeRange = document.getElementById(
  'layerStrokeSizeRange'
);

export const layerShadowXLabel = document.getElementById('layerShadowXLabel');
export const layerShadowXRange = document.getElementById('layerShadowXRange');

export const layerShadowYLabel = document.getElementById('layerShadowYLabel');
export const layerShadowYRange = document.getElementById('layerShadowYRange');

export const layerShadowSizeLabel = document.getElementById('layerShadowSizeLabel');
export const layerShadowSizeRange = document.getElementById('layerShadowSizeRange');

export const layerOpacityRange = document.getElementById('layerOpacityRange');
export const layerOpacityLabel = document.getElementById('layerOpacityLabel');


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

const fontOptionsBtn = document.getElementById('fontOptionsBtn');
const fillOptionsBtn = document.getElementById('fillOptionsBtn');
const toggleButtonDark = document.querySelectorAll('.toggleButtonDark');


export const layerLineHeightLabel = document.getElementById(
  'layerLineHeightLabel'
);
export const layerLineHeightRange = document.getElementById(
  'layerLineHeightRange'
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

export const layerShadowOpacityLabel = document.getElementById('layerShadowOpacityLabel');
export const layerShadowOpacityRange = document.getElementById('layerShadowOpacityRange');





export let fillColor = '#419ec7';
export let strokeColor = '#878787';
export let shadowColor = '#666666';
let layerWidth = 100;
let layerHeight = 100;
let strokeSize = 0;
let activeLayerColor = '';


toggleButtonDark.forEach((toggleButton)=>{
  toggleButton.addEventListener('click', ()=>{
    toggleButton.classList.toggle('invert');
  })
  
})

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
      strokeSizeRange.value = 0;
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

  width: 130, // Set the size of the color picker
  color: fillColor, // Set the initial color to pure red
  handleRadius: 8,
  layoutDirection : "horizontal",
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
  width: 130, // Set the size of the color picker
  color: strokeColor, // Set the initial color to pure red
  handleRadius: 8,
  layoutDirection : "horizontal",
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

  width: 130, // Set the size of the color picker
  color: shadowColor, // Set the initial color to pure red
  handleRadius: 8,
  layoutDirection : "horizontal",
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
    if (layerStrokeSizeRange.value === '0') {
      layerStrokeSizeRange.value = 1;
    }
  }

  if (color != '#none') {
    //Check if color is a Hex String
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      iroColor.color.hexString = color;
      //mainCanvasColor = iroColor.color.rgbaString;
      const hex = iroColor.color.hexString;
      //pickerElement.style.backgroundColor = hex;
      input.value = hex;
    }
  } else {
    input.value = '#none';
    updateLayer(true);
  }
};

//Stroke Size Input & Slider
layerStrokeSizeRange.addEventListener('input', () => {
  layerStrokeSizeLabel.innerHTML = layerStrokeSizeRange.value;
  updateLayer();
});


//    Save To History
layerStrokeSizeRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Shadow Blur Size Input & Slider
layerShadowSizeRange.addEventListener('input', () => {

    layerShadowSizeLabel.innerHTML = layerShadowSizeRange.value;
    updateLayer();

});


//    Save To History
layerShadowSizeRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

// Shadow X Y Position

layerShadowXRange.addEventListener('input', () => {

    layerShadowXLabel.innerHTML = layerShadowXRange.value;
    updateLayer();

});



//    Save To History
layerShadowXRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

layerShadowYRange.addEventListener('input', () => {
    layerShadowYLabel.innerHTML = layerShadowYRange.value;
    updateLayer();
});



//    Save To History
layerShadowYRange.addEventListener('mouseup', () => {
  updateLayer(true);
});



// Layer Shadow Opacity

layerShadowOpacityRange.addEventListener('input', () => {
  layerShadowOpacityLabel.innerHTML = layerShadowOpacityRange.value;
  updateLayer();
});



//    Save To History
layerShadowOpacityRange.addEventListener('mouseup', () => {
updateLayer(true);
});


//Line Height Input & Slider
layerLineHeightRange.addEventListener('input', () => {
  layerLineHeightLabel.innerHTML = layerLineHeightRange.value;
  updateLayer();
});



//    Save To History
layerLineHeightRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Opacity Input & Slider
layerOpacityRange.addEventListener('input', () => {
  layerOpacityLabel.innerHTML = layerOpacityRange.value;
  updateLayer();
});

//    Save To History
layerOpacityRange.addEventListener('mouseup', () => {
  updateLayer(true);
});

//Layer Width Input & Slider

// layerWidthRange.addEventListener('mousemove', () => {
//   if (layerWidthInput.value != layerWidthRange.value) {
//     layerWidthInput.value = layerWidthRange.value;
//   }
// });

// layerWidthInput.addEventListener('click', (e) => {
//   closeDialogues();
//   layerWidthRange.parentElement.style.display = 'block';
//   e.stopPropagation();
// });

//Layer Height Input & Slider

// layerHeightRange.addEventListener('mousemove', () => {
//   if (layerHeightInput.value != layerHeightRange.value) {
//     layerHeightInput.value = layerHeightRange.value;
//   }
// });

// layerHeightInput.addEventListener('click', (e) => {
//   closeDialogues();
//   layerHeightRange.parentElement.style.display = 'block';
//   e.stopPropagation();
// });

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

layerStrokeSizeRange.value  = strokeSize;

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



setColorToElements(
  fillColor, 
  fillPickerSwatch, 
  fillColorInput, 
  fillPicker
  );

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
    layer.addEventListener('click', (e) => {
      if (document.querySelector('.activeLayerInLayerList')) {
        document
          .querySelector('.activeLayerInLayerList')
          .classList.remove('activeLayerInLayerList');
      }
      // if a click was on a layer name
      if (e.target.nodeName === 'LI') {
        unselectAllLayers(false);
        // Highlight layer List Item

        e.target.classList.add('activeLayerInLayerList');
        // Make Layer Active

        makeActive(e.target.id.replace(/layerListItem/g, ''), false);
      } else {
        //Otherwise remove it (X - button pressed)
        e.target.parentElement.style.display = 'none';
      }
    });
    layer.addEventListener('mouseover', (event) => {});
  });
};

// X Position Input on Input

// xPos.addEventListener('change', (e) => {
//   moveLayerTo(xPos.value, yPos.value);
// });

// yPos.addEventListener('change', (e) => {
//   moveLayerTo(xPos.value, yPos.value);
// });

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
    activeLayer.strokeSize = layerStrokeSizeRange.value;
    activeLayer.shadowBlurSize = layerShadowSizeRange.value;
    activeLayer.shadowOffsetX = layerShadowXRange.value;
    activeLayer.shadowOffsetY = layerShadowYRange.value;
    activeLayer.opacity = layerOpacityRange.value ;
    activeLayer.shadowOpacity = layerShadowOpacityRange.value ;

    // Text & QR Specific Options
    if (
      activeLayer.contentType === 'text' ||
      activeLayer.contentType === 'qr'
    ) {
      textContentInput.value = activeLayer.content;
      // activeLayer.fontSize = parseInt(layerFontSizeInput.value);
      activeLayer.lineHeight = layerLineHeightRange.value;
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

      layerListItem.childNodes[1].nodeValue = content;
      activeLayer.fileName = activeLayer.contentType != 'text' ? content : '';

    }

    applyChangesToLayer(SAVE_TO_HISTORY);
    //drawCanvas(SAVE_TO_HISTORY);
    //makeActive(false);
  } catch (e) {
    console.log(e);
  }
};

export const updateLayerOptionValues = (id) => {
  // fontOptionsSection.style.display = 'none';
  // fillColorSection.style.display = 'none';
  fontOptionsBtn.disabled = 'true';
  fillOptionsBtn.disabled = 'true';
  
  

  // xPos.value = activeLayer.left;
  // yPos.value = activeLayer.top;
  // layerWidthRange.value = parseInt(activeLayer.width);
  // layerHeightRange.value = parseInt(activeLayer.height);
  layerStrokeSizeRange.value = activeLayer.strokeSize;
  layerShadowSizeRange.value = activeLayer.shadowBlurSize;
  layerShadowXRange.value = activeLayer.shadowOffsetX;
  layerShadowYRange.value = activeLayer.shadowOffsetY;
  layerOpacityRange.value = activeLayer.opacity ;
  layerShadowOpacityRange.value = activeLayer.shadowOpacity ;



  //Text specific Layer Options
  if (activeLayer.contentType === 'text' || activeLayer.contentType === 'qr') {
    textContentInput.value = activeLayer.content;
    //layerFontSizeInput.value = activeLayer.fontSize;
    //layerFontSizeRange.value = activeLayer.fontSize;
    layerLineHeightLabel.innerHTML = activeLayer.lineHeight;
    layerLineHeightRange.value = activeLayer.lineHeight;

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

    // layerWidthInput.disabled = true;
    // layerWidthInput.value = activeLayer.width;
    // layerHeightInput.disabled = true;
    // layerHeightInput.value = activeLayer.height;

    // fontOptionsSection.style.display = 'block';
    // fillColorSection.style.display = 'block';




    fontOptionsBtn.removeAttribute('disabled');
    fillOptionsBtn.removeAttribute('disabled');

  }

  //Icon Specific options
  if (activeLayer.contentType === 'shape') {
    
    fontOptionsBtn.removeAttribute('disabled');
    fillOptionsBtn.removeAttribute('disabled');

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
