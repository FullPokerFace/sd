import { makeId } from './makeId.js';
import {
  layerListItemBind,
  layerList,
  fillColor as initFillColor,
  strokeColor,
  shadowColor,
  updateLayerOptionValues,
  showHideLayerOptions,
  updateLayer,
} from '../modules/LayerOptions.js';

import { updateText } from '../libs/canvasFunctions/drawText.js';
import {
  updateImage,
  drawImage,
  resizeImage,
} from '../libs/canvasFunctions/drawImage.js';
import { updateQR, resizeQR } from '../libs/canvasFunctions/drawQR.js';
import { updateShape } from '../libs/canvasFunctions/drawShape.js';
import { alignLayer } from '../modules/topMenu.js';

import { moveable } from '../modules/Init.js';

export let activeLayer = null;
export let layers = [];
let zIndex = 100;
export let cHeightBeforeResize;
export let cWidthBeforeResize;

export const setHeightBeforeResize = (width, height) => {
  cWidthBeforeResize = width; //Needed for Resize Handle
  cHeightBeforeResize = height; //Needed for Resize Handle
};

const addLayerListUL = (id, content, contentType, fileName, container) => {
  //Layer List Remove Button - Layer Option Section

  const layerListItemRemove = document.createElement('span');
  layerListItemRemove.innerHTML = 'x';
  layerListItemRemove.id = `layerListItemRemove${id}`;
  layerListItemRemove.className = 'removeLayerFromLayerList';
  layerListItemRemove.addEventListener('click', () => {
    makeActive(id);
    removeLayer(id);
  });
  //----------------------------

  //Layer List Item - Layer Option Section
  const layerListItem = document.createElement('li');
  const layerListItemId = `layerListItem${id}`;
  layerListItem.id = layerListItemId;
  //layerListItem.className = 'layerListItem';
  if (contentType === 'text') {
    content = content.length > 20 ? `${content.substring(0, 20)}....` : content;
    layerListItem.innerHTML = content;
  }
  if (contentType === 'image') {
    fileName =
      fileName.length > 20
        ? `${fileName.substring(0, 20)}${fileName.substring(
            fileName.length - 4,
            fileName.length
          )}`
        : fileName;
    layerListItem.innerHTML = fileName;
  }
  if (contentType == 'qr') {
    layerListItem.innerHTML =
      content.length > 20 ? `${content.substring(0, 20)}....` : content;
  }

  if (contentType == 'shape') {
    fileName =
      fileName.length > 20
        ? `${fileName.substring(0, 20)}${fileName.substring(
            fileName.length - 4,
            fileName.length
          )}`
        : fileName;
    layerListItem.innerHTML = fileName;
  }

  // Add Pop Effect
  layerListItem.addEventListener('mouseover', function () {
    container.dispatchEvent(new Event('mouseover'));
  });

  // Remove Pop Effect
  layerListItem.addEventListener('mouseout', function () {
    container.dispatchEvent(new Event('mouseout'));
  });

  //----------------------------

  // Add Layer Remove Button to Layer List Item
  layerListItem.appendChild(layerListItemRemove);
  // Add Layer Item to Layer List
  document.getElementById('layerList').prepend(layerListItem);
  // Bind Click events to New Layer List
  layerListItemBind();
  //----------------------------

  // $('.layerList').sortable({
  //   update: function () {
  //     resetZIndex();
  //   },
  // });

  sortable('.layerList', {
    forcePlaceholderSize: true,
  });
};

sortable('.layerList')[0].addEventListener('sortstop', function (e) {
  let newIndex = 100;
  const layerListItems = sortable('.layerList', 'serialize')[0].items.reverse();
  layerListItems.map((item) => {
    const id = item.node.id.replace('layerListItem', '');
    const layerIndex = (layer) => layer.id === id;
    layers[layers.findIndex(layerIndex)].zIndex = newIndex;
    document.getElementById(id).style.zIndex = newIndex;
    newIndex++;
  });
  /*

  This event is triggered when the user stops sorting and the DOM position has not yet changed.

  e.detail.item - {HTMLElement} dragged element

  Origin Container Data
  e.detail.origin.index - {Integer} Index of the element within Sortable Items Only
  e.detail.origin.elementIndex - {Integer} Index of the element in all elements in the Sortable Container
  e.detail.origin.container - {HTMLElement} Sortable Container that element was moved out of (or copied from)
  */
});

const addLayerTools = () => {
  ///Remove & Duplicate tools for canvas
  const canvasToolsUL = document.createElement('ul');
  canvasToolsUL.classList.add('canvasTools');
  const canvasToolsImg = [
    './assets/canvasTools/removeLayer.svg',
    './assets/canvasTools/duplicateLayer.svg',
  ];

  canvasToolsImg.forEach((img) => {
    const canvasToolsLI = document.createElement('li');
    const canvasToolsIMG = document.createElement('img');
    canvasToolsIMG.src = img;
    canvasToolsUL.appendChild(canvasToolsLI);
    canvasToolsLI.appendChild(canvasToolsIMG);
  });
  canvasToolsUL.childNodes[0].addEventListener('mousedown', () => {
    makeActive(activeLayer.id);
    removeLayer(activeLayer.id);
  });
  canvasToolsUL.childNodes[1].addEventListener('mousedown', () => {
    duplicateLayer();
  });
  document.querySelector('.moveable-ne').appendChild(canvasToolsUL);
  //----------------------------

  //Layer Label
  const idLabel = document.createElement('span');
  idLabel.id = `layerLabel`;
  idLabel.className = 'layerLabel';

  document.querySelector('.moveable-ne').appendChild(idLabel);

  //--------------------------
};

const addDiv = (id, content, contentType, fileName, fontFamily) => {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'canvasContainer';

  if (contentType === 'text') {
    // const outlineDiv = document.createElement('span');
    // outlineDiv.className = 'editable-outline';
    // container.appendChild(outlineDiv);
    const editableContainer = document.createElement('div');
    editableContainer.className = 'editable';
    container.appendChild(editableContainer);

    editableContainer.addEventListener('dblclick', (e) => {
      e.target.contentEditable = 'true';
      e.target.parentElement.style.cursor = 'text';
      e.target.focus();
      moveable.target = null;
    });
    editableContainer.addEventListener('keyup', (e) => {
      activeLayer.content = editableContainer.innerText;
      updateLayer();
    });
  }

  if (contentType === 'shape') {
    const svgData = content.substring(
      content.indexOf('>') + 1,
      content.lastIndexOf('</svg>')
    );

    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 512 512');
    svg.setAttribute('width', '100px');
    svg.setAttribute('height', '100px');
    svg.innerHTML = svgData;
    svg.getElementsByTagName('*').forEach((el) => {
      el.setAttribute('data-orig-color', el.style.cssText);
    });
    container.appendChild(svg);
  }

  if (contentType === 'image') {
    const img = content.cloneNode(true);
    img.crossOrigin = 'anonymous';
    container.appendChild(img);
    console.log(img.height);
    if (img.height > 300) img.style.height = '300px';
  }

  if (contentType === 'qr') {
    const qr = kjua({
      text: content,
      render: 'svg',
      size: 300,
      background: null,
      fill: '#419ec7',
    });

    container.appendChild(qr);
  }
  container.firstChild.addEventListener('mousedown', () => {
    if (activeLayer === null) {
      unselectAllLayers(false);
      makeActive(id, true);
    } else if (activeLayer.id != id) {
      unselectAllLayers(false);
      makeActive(id, true);
    }
  });

  container.style = activeLayer.cssText;
  // container.style.zIndex = activeLayer.zIndex;
  // zIndex++;
  if (activeLayer.childCssText) {
    container.firstChild.style = activeLayer.childCssText;
  } else activeLayer.childCssText = container.firstChild.style.cssText;

  document.getElementById('mainCanvasContainer').appendChild(container);

  addLayerListUL(id, content, contentType, fileName, container);
  applyChangesToLayer(false);
};

///   Init options

addLayerTools();
moveable.on('dragEnd', ({ target, isDrag }) => {
  if (isDrag) {
    activeLayer.cssText = target.style.cssText;
    saveToHistory('move');
  }
});

moveable.on('drag', ({ target, isDrag }) => {
  showOverflowLayer(activeLayer.id);
});

moveable.on('scale', ({ target, isDrag }) => {
  showOverflowLayer(activeLayer.id);
});

moveable.on('scaleEnd', ({ target, isDrag }) => {
  if (isDrag) {
    activeLayer.cssText = target.style.cssText;
    saveToHistory('scale');
  }
});

moveable.on('rotateEnd', ({ target, isDrag }) => {
  if (isDrag) {
    activeLayer.cssText = target.style.cssText;
    saveToHistory('rotate');
  }
});
//    --    --    --    --

export const CL = (
  { id, content, contentType, fillColor, fontFamily, rotationAngle, fileName },
  layerObject
) => {
  //fileName = content.src.replace(/^.*[\\\/]/, '');

  let width = 0;
  let height = 0;
  if (contentType === 'shape') {
    width = 100;
    height = 100;
  }
  ///
  // const container = addContainerDiv(id, content, fileName, content.src).then(
  //   () => {
  //     console.log(container);
  //   }
  // );
  // document.getElementById('mainCanvasContainer').appendChild(container);
  // addLayerListUL(id, content, contentType, fileName, container);
  // addLayerTools(id, container);

  // // tempDiv.contentEditable = 'true';
  // // tempDiv.innerHTML = 'Text';

  // const width = container.getBoundingClientRect().width.toFixed(0);
  // const height = container.getBoundingClientRect().height.toFixed(0);

  const layerData = layerObject || {
    id,
    content,
    contentType,
    width,
    height,
    isActive: false,
    isVisible: true,
    canvasRatio: parseFloat((width / height).toFixed(2)),
    imageRatio: parseFloat((width / height).toFixed(2)),
    fileName: fileName,
    imgUrl: typeof content != 'object' ? '' : content.src,
    left: 0,
    top: 0,
    color: fillColor || initFillColor,
    strokeColor: strokeColor,
    strokeSize: 0,
    shadowColor: shadowColor,
    shadowBlurSize: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    opacity: 1,
    flipHorizontal: false,
    flipVertical: false,
    rotationAngle: rotationAngle || 0,
    cssText: '',
    childCssText: '',
    zIndex: zIndex,
    ///

    fontFamily,
    fontSize: 40,
    fontStyle: 'Normal Italic Bold',
    fontOptions: ['left'],
    lineHeight: 1.2,
  };
  layers.push(layerData);

  activeLayer = layers[layers.length - 1];
  addDiv(
    activeLayer.id,
    activeLayer.content,
    activeLayer.contentType,
    activeLayer.fileName,
    activeLayer.fontFamily
  );
  saveToHistory('created');
  // moveable.target = document.getElementById(id);
  // fitToPage();
  // alignLayer('center');
  // moveable.target = null;
  activeLayer = null;
  //history.length = history.length - 2;
  //console.table(layers);
};

export const createLayer = (
  {
    id,
    content,
    contentType,
    fontFamily,
    imgWidth,
    imgHeight,
    fileName,
    imgUrl,
    fillColor,
    rotationAngle,
    layerObject,
  },
  SAVE_TO_HISTORY = true
) => {
  //    Unselect all layers if it's not the first layer
  if (layers.length != 0 && SAVE_TO_HISTORY) {
    unselectAllLayers();
  }

  // Create Canvas Element
  const newLayerId = id;
  let newLayer = document.createElement('canvas');
  newLayer.id = newLayerId;

  // Make Canvas Active On MouseDown
  newLayer.addEventListener('mousedown', function (e) {
    if (activeLayer === null) {
      unselectAllLayers(false);
      makeActive(newLayerId, true);
    } else if (activeLayer.id != newLayerId) {
      unselectAllLayers(false);
      makeActive(newLayerId, true);
    }
  });

  // If Canvas is text edit it on double click
  newLayer.addEventListener('dblclick', function (e) {
    document.getElementById('textContentInput').focus();
  });

  // Stop propagation on click to prevent Drawing Area's onClick which unselect all layers
  newLayer.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Add Pop Effect
  newLayer.addEventListener('mouseover', function () {
    if (!this.parentElement.classList.contains('activeLayer')) {
      this.parentElement.classList.add('highlightedLayer');
    }
  });

  // Remove Pop Effect
  newLayer.addEventListener('mouseout', function () {
    this.parentElement.classList.remove('highlightedLayer');
    if (activeLayer != null) {
      document
        .getElementById(`${activeLayer.id}`)
        .parentElement.classList.add('activeLayer');
    }
  });
  //----------------------------

  // Position Div for X | Y position
  let positionDiv = document.createElement('div');
  const positionDivId = 'positionDiv' + id;
  positionDiv.id = positionDivId;
  positionDiv.classList.add('position-div');
  positionDiv.style = `z-index : ${zIndex}`;
  zIndex++;
  //----------------------------

  // Canvas Container Element for Rotate & Resize
  let canvasContainer = document.createElement('div');
  const canvasContainerId = 'canvasDiv' + id;
  canvasContainer.id = canvasContainerId;
  canvasContainer.style = 'position: absolute;';
  canvasContainer.classList.add('canvasContainer');
  //----------------------------

  ///Remove & Duplicate tools for canvas
  const canvasToolsUL = document.createElement('ul');
  canvasToolsUL.classList.add('canvasTools');
  const canvasToolsImg = [
    './assets/canvasTools/removeLayer.svg',
    './assets/canvasTools/duplicateLayer.svg',
  ];

  canvasToolsImg.forEach((img) => {
    const canvasToolsLI = document.createElement('li');
    const canvasToolsIMG = document.createElement('img');
    canvasToolsIMG.src = img;
    canvasToolsUL.appendChild(canvasToolsLI);
    canvasToolsLI.appendChild(canvasToolsIMG);
  });
  canvasToolsUL.childNodes[0].addEventListener('mousedown', () => {
    makeActive(newLayerId);
    removeLayer(newLayerId);
  });
  canvasToolsUL.childNodes[1].addEventListener('mousedown', () => {
    duplicateLayer();
  });
  //----------------------------

  //   ///Div Element for Delete Handle
  //   let removeHandle = document.createElement('div');
  //   const removeHandleId = 'removeLayer' + id;
  //   removeHandle.id = removeHandleId;
  //   removeHandle.className = 'removeHandle';
  //   removeHandle.innerHTML = id;
  //   removeHandle.addEventListener('mousedown', function () {
  //     makeActive(newLayerId);
  //     removeLayer(newLayerId);
  //   });
  //   ///////

  //   ///Div Element for Resize Handle
  //   let resizeHandle = document.createElement('div');
  //   const resizeHandleId = 'resizeLayer' + id;
  //   resizeHandle.id = resizeHandleId;
  //   resizeHandle.className = 'resizeHandle';
  //   ///////

  //   ///Div Element for Resize Handle
  //   let resizeHandleSW = document.createElement('div');
  //   const resizeHandleIdSW = 'resizeLayerSW' + id;
  //   resizeHandleSW.id = resizeHandleIdSW;
  //   resizeHandleSW.className = 'resizeHandleSW';
  //   ///////

  //Layer List Remove Button - Layer Option Section

  const layerListItemRemove = document.createElement('span');
  layerListItemRemove.innerHTML = 'x';
  layerListItemRemove.id = `layerListItemRemove${id}`;
  layerListItemRemove.className = 'removeLayerFromLayerList';
  layerListItemRemove.addEventListener('click', function () {
    //makeActive(newLayerId);
    removeLayer(newLayerId);
  });
  //----------------------------

  //Layer List Item - Layer Option Section
  const layerListItem = document.createElement('li');
  const layerListItemId = `layerListItem${id}`;
  layerListItem.id = layerListItemId;
  //layerListItem.className = 'layerListItem';
  if (contentType === 'text') {
    content = content.length > 20 ? `${content.substring(0, 20)}....` : content;
    layerListItem.innerHTML = content;
  }
  if (contentType === 'image') {
    fileName =
      fileName.length > 20
        ? `${fileName.substring(0, 20)}${fileName.substring(
            fileName.length - 4,
            fileName.length
          )}`
        : fileName;
    layerListItem.innerHTML = fileName;
  }
  if (contentType == 'qr') {
    layerListItem.innerHTML =
      content.length > 20 ? `${content.substring(0, 20)}....` : content;
  }

  if (contentType == 'shape') {
    fileName =
      fileName.length > 20
        ? `${fileName.substring(0, 20)}${fileName.substring(
            fileName.length - 4,
            fileName.length
          )}`
        : fileName;
    layerListItem.innerHTML = fileName;
  }

  // Add Pop Effect
  layerListItem.addEventListener('mouseover', function () {
    newLayer.dispatchEvent(new Event('mouseover'));
  });

  // Remove Pop Effect
  layerListItem.addEventListener('mouseout', function () {
    newLayer.dispatchEvent(new Event('mouseout'));
  });

  //----------------------------

  //Layer Label
  const idLabel = document.createElement('span');
  idLabel.id = `layerLabel${id}`;
  idLabel.className = 'layerLabel';
  idLabel.innerHTML = contentType != 'text' ? layerListItem.innerHTML : '';
  canvasContainer.appendChild(idLabel);

  //--------------------------

  // Add Layer Remove Button to Layer List Item
  layerListItem.appendChild(layerListItemRemove);
  // Add Layer Item to Layer List
  document.getElementById('layerList').prepend(layerListItem);
  // Bind Click events to New Layer List
  layerListItemBind();
  //----------------------------

  // Add Canvas New Canvas Layer on Screen
  let canvasWrapper = document.getElementById('mainCanvasContainer');
  //let theFirstChild = canvasWrapper.firstChild;
  canvasWrapper.append(positionDiv); //insertBefore(positionDiv, theFirstChild);

  //Add
  positionDiv.appendChild(canvasContainer);
  //   document.getElementById(canvasContainerId).appendChild(removeHandle);
  //   document.getElementById(canvasContainerId).appendChild(resizeHandle);
  //   document.getElementById(canvasContainerId).appendChild(resizeHandleSW);
  document.getElementById(canvasContainerId).appendChild(canvasToolsUL);
  document.getElementById(canvasContainerId).appendChild(newLayer);

  // $(`#${positionDivId}`).draggable({
  //   drag: () => {
  //     showOverflowLayer(newLayerId);
  //   },

  //   stop: function () {
  //     saveLayerPositionToHistory();
  //   },
  // });

  // move.on('resize', ({ target, width, height }) => {
  //   target.style.width = width + 'px';
  //   target.style.height = height + 'px';
  // });

  // $('#layerList').sortable({
  //   update: function () {
  //     resetZIndex();
  //   },
  // });
  // $('#layerList').disableSelection();
  // $(`#${canvasContainerId}`)
  //   .resizable({
  //     minHeight: 25,
  //     autoHide: false,
  //     aspectRatio: true,
  //     handles: 'se, ne',

  //     classes: {
  //       'ui-resizable-se': 'resizeHandleSE',
  //       //'ui-resizable-sw': 'resizeHandleSW',
  //       'ui-resizable-ne': 'resizeHandleNE',
  //       //'ui-resizable-nw': 'resizeHandleNW',
  //       'ui-resizable-resizing': 'layerResize',
  //     },
  //     //aspectRatio: true,
  //     start: () => {},
  //     stop: function () {
  //       saveToHistory('resize');
  //       updateLayerOptionValues(id);
  //     },
  //     resize: () => {
  //       showOverflowLayer(newLayerId);
  //     },
  //   })
  //   .rotatable({
  //     wheelRotate: false,
  //     degrees: rotationAngle || 0,
  //     stop: (ui, e) => {
  //       activeLayer.rotationAngle = e.angle.degrees;
  //       saveToHistory('draw');
  //     },
  //   });

  const newLayerData = layerObject || {
    id,
    content,
    contentType,
    width: imgWidth,
    height: imgHeight,
    imgWidth,
    imgHeight,
    className: '',
    isActive: false,
    padding: 20,
    addWidth: 0,
    addHeight: 0,
    imgRatio: parseFloat((imgWidth / imgHeight).toFixed(2)),
    canvasRatio: 0,
    fileName,
    imgUrl,
    qrSize: imgWidth,
    left: 100,
    top: 0,
    fontFamily,
    fontSize: 70,
    fontStyle: 'Normal Italic Bold',
    color: fillColor || initFillColor,
    strokeColor: strokeColor,
    strokeSize: 0,
    shadowColor: shadowColor,
    shadowBlurSize: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    opacity: 1,
    flipHorizontal: false,
    flipVertical: false,
    lineHeight: 1,
    underline: false,
    crossline: false,
    fontOptions: ['leftAlign'],
    isVisible: true,
    rotationAngle: rotationAngle || 0,
  };
  layers.push(newLayerData);

  // $('#' + canvasContainerId).resize(function () {
  //   switch (contentType) {
  //     case 'text':
  //       resizeText();
  //       break;
  //     case 'image':
  //       resizeImage();
  //       break;
  //     case 'qr':
  //       resizeQR();
  //       break;
  //     case 'shape':
  //       resizeShape();
  //       break;
  //   }
  // });

  positionDiv.style.left = newLayerData.left + 'px';
  positionDiv.style.top = newLayerData.top + 'px';

  activeLayer = layers[layers.length - 1];
  if (SAVE_TO_HISTORY) {
    saveToHistory('created');
  }
};

export const applyChangesToLayer = (SAVETOHISTORY = true) => {
  if (activeLayer.contentType === 'shape') {
    updateShape();
  }
  if (activeLayer.contentType === 'image') {
    updateImage();
  }
  if (activeLayer.contentType === 'text') {
    updateText();
  }
  if (activeLayer.contentType === 'qr') {
    updateQR();
  }

  if (SAVETOHISTORY) {
    saveToHistory('draw');
  }
};

export const drawCanvas = (SAVETOHISTORY = true) => {
  if (activeLayer.contentType == 'text') {
    drawText();
  }
  if (activeLayer.contentType == 'image') {
    drawImage();
  }
  if (activeLayer.contentType == 'qr') {
    drawQR();
  }
  if (activeLayer.contentType == 'shape') {
    drawShape();
  }
  if (SAVETOHISTORY) {
    saveToHistory('draw');
  }

  //console.log(layers);
};

export const canvasSetSize = (cWidth, cHeight) => {
  const id = activeLayer.id;

  $(`#canvasDiv${id}`).css('width', cWidth);
  $(`#canvasDiv${id}`).css('height', cHeight);

  $(`#${id}`).attr('width', cWidth);
  $(`#${id}`).attr('height', cHeight);

  activeLayer.width = cWidth;
  activeLayer.height = cHeight;
  activeLayer.canvasRatio = (cWidth / cHeight).toFixed(3);
};

export const flipCanvas = () => {
  const layerId = activeLayer.id;
  //Flip
  var canvas = document.getElementById(layerId);
  var ctx = canvas.getContext('2d');
  let cWidth = canvas.width;
  let cHeight = canvas.height;
  if (activeLayer.flipVertical) {
    // translate context to center of canvas
    ctx.translate(0, cHeight);

    // flip context horizontally
    ctx.scale(1, -1);
  }

  //Flip
  if (activeLayer.flipHorizontal) {
    // translate context to center of canvas
    ctx.translate(cWidth, 0);

    // flip context horizontally
    ctx.scale(-1, 1);
  }
};

export const applyEffect = () => {
  const {
    id,
    imgWidth,
    imgHeight,
    shadowColor,
    shadowBlurSize,
    strokeSize,
    shadowOffsetX,
    shadowOffsetY,
    content,
    contentType,
  } = activeLayer;

  const effectsAddWidth =
    parseInt(shadowBlurSize) * 2 + parseInt(shadowOffsetX) * 2;
  const effectsAddHeight =
    parseInt(shadowBlurSize) * 2 + parseInt(shadowOffsetY) * 2;

  let canvas = document.getElementById(id);
  let ctx = canvas.getContext('2d');
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlurSize;
  ctx.shadowOffsetX = shadowOffsetX;
  ctx.shadowOffsetY = shadowOffsetY;
};

export const resizeText = () => {
  const { id, content, fontSize } = activeLayer;

  if (content) {
    const divHeight = parseInt(
      document.getElementById(`canvasDiv${id}`).style.height
    );
    // const divHeight = parseInt($('#canvasDiv' + id).css('height'));

    let widthToTextSizeRatio = cHeightBeforeResize / fontSize;
    let textHeight = divHeight / widthToTextSizeRatio;
    activeLayer.fontSize =
      Math.round(textHeight) > 20 ? Math.round(textHeight) : 20;
    $('#fontSize').val(activeLayer.fontSize);
    drawCanvas(false);
  }
};

// Remove Layer
const removeLayer = (id, SAVE_TO_HISTORY = true) => {
  console.log('RemoveLayer' + id);
  const layerIndex = (layer) => layer.id === id;
  activeLayer = layers[layers.findIndex(layerIndex)];
  moveable.target = null;
  activeLayer.isVisible = false;
  activeLayer.isActive = false;
  document.getElementById(id).style.display = 'none';
  document.getElementById(`layerListItem${id}`).style.display = 'none';
  if (SAVE_TO_HISTORY) {
    saveToHistory('removed');
  }
  showHideLayerOptions('hide');
};
//----------------------------

// Show Layer
function showLayer(id, SAVE_TO_HISTORY = true) {
  document.getElementById(id).style.display = 'block';
  document.getElementById(`layerListItem${id}`).style.display = 'block';
  if (SAVE_TO_HISTORY) {
    saveToHistory('show');
  }
}
//----------------------------
export const removeAllLayers = (SAVE_TO_HISTORY = true) => {
  if (layers.length > 0) {
    layers.map((layer) => {
      if (layer.contentType != 'bg' && layer.isVisible === true)
        removeLayer(layer.id, SAVE_TO_HISTORY);
    });
  }
};

export const duplicateLayer = () => {
  const id = makeId(5);
  if (activeLayer) {
    //let duplicateLayer = jQuery.extend({}, activeLayer);
    let duplicateLayer = {};
    duplicateLayer = Object.assign(duplicateLayer, activeLayer);
    // Create Layer for a duplicated
    duplicateLayer.id = id;

    CL(
      {
        id,
        content: duplicateLayer.content,
        contentType: duplicateLayer.contentType,
        fontFamily: duplicateLayer.fontFamily,
        fileName: duplicateLayer.fileName,
      },
      duplicateLayer
    );
    unselectAllLayers();
    makeActive(id);
    //applyChangesToLayer();

    // Copy all properties
    // for (const property in activeLayer) {
    //   activeLayer[property] = duplicateLayer[property];
    // }
    //activeLayer.id = id;
    //activeLayer.isActive = false;
    // Draw Duplicated Canvas
    //drawCanvas();
    // Make it active
    //makeActive(id);
  }
};

function resetZIndex() {
  const layerList = document.querySelectorAll('.layerList>li');
  let topZIndex = 1000;
  layerList.forEach((node) => {
    const id = node.id.replace('layerListItem', 'positionDiv');
    document.getElementById(id).style.zIndex = topZIndex;
    topZIndex--;
  });
}

const showOverflowLayer = (id) => {
  const containerBox = document
    .getElementById('mainCanvasContainer')
    .getBoundingClientRect();
  const container = document.getElementById(id);
  if (
    container.getBoundingClientRect().left + 1 < containerBox.left ||
    container.getBoundingClientRect().right - 1 > containerBox.right ||
    container.getBoundingClientRect().top + 1 < containerBox.top ||
    container.getBoundingClientRect().bottom - 1 > containerBox.bottom
  ) {
    document.getElementById('mainCanvasContainer').style.overflow = 'visible';
  } else {
    document.getElementById('mainCanvasContainer').style.overflow = 'hidden';
  }
};

export const makeActive = (id, SAVETOHISTORY = true) => {
  console.log('Make Active');
  const layerIndex = (layer) => layer.id === id;
  activeLayer = layers[layers.findIndex(layerIndex)];

  if (activeLayer.isActive != true) {
    showOverflowLayer(id);

    // Highlight current layer as active
    document.getElementById('layerLabel').innerHTML = activeLayer.fileName;
    const canvasContainer = document.getElementById(id);
    moveable.target = canvasContainer;

    //canvasContainer.className += ' activeLayer';

    const layerIndex = (layer) => layer.id === id;
    activeLayer = layers[layers.findIndex(layerIndex)];
    activeLayer.isActive = true;

    //Show Layer Options

    showHideLayerOptions('show');

    // Show Canvas Tools
    document.querySelector('.canvasTools').style.display = 'block';
    // canvasContainer.querySelector('.ui-rotatable-handle').style.display =
    //   'block';

    // Update Layer Option Values
    updateLayerOptionValues(id);

    // Highlight Layer in the layer list
    // try {
    //   document
    //     .querySelector('.activeLayerInLayerList')
    //     .classList.remove('activeLayerInLayerList');
    // } catch (error) {}

    // document
    //   .getElementById(`layerListItem${activeLayer.id}`)
    //   .classList.add('activeLayerInLayerList');

    document.getElementById(`layerListItem${id}`).click();
    if (SAVETOHISTORY) {
      saveToHistory('active');
    }
  }
};

export const unselectAllLayers = (SAVETOHISTORY = true) => {
  // const canvasContainers = document.querySelectorAll('.activeLayer ');
  // if (canvasContainers.length != 0) {
  //   canvasContainers.forEach((container) => {
  //     container.classList.remove('activeLayer');
  //     container.querySelector('.canvasTools').style.display = 'none';
  //     container.querySelector('.ui-rotatable-handle').style.display = 'none';
  //     $(`#${container.id}`).resizable({
  //       handles: 'none',
  //     });
  //     if (SAVETOHISTORY) {
  //       saveToHistory('inactive');
  //     }
  //   });
  moveable.target = null;
  document.getElementById('mainCanvasContainer').style.overflow = 'hidden';
  const container = document.querySelector('.activeLayer');
  if (
    layers.some((layer) => layer.isVisible === true && layer.isActive === true)
  ) {
    //container.classList.remove('activeLayer');
    //container.querySelector('.canvasTools').style.display = 'none';
    //container.querySelector('.ui-rotatable-handle').style.display = 'none';
    // $(`#${container.id}`).resizable({
    //   handles: 'none',
    // });

    if (SAVETOHISTORY) {
      saveToHistory('inactive');
    }

    layers.forEach((layer) => {
      if (layer.isActive) layer.isActive = false;

      document.querySelector(`#layerListItem${layer.id}`).className = '';
    });

    activeLayer = null;
  }
  showHideLayerOptions('hide');
};

const makeNotActive = (SAVETOHISTORY = true) => {
  // // Unselect all layers
  // const layerIndex = (layer) => layer.className === 'activeLayer';
  // activeLayer = layers[layers.findIndex(layerIndex)];
  // if (activeLayer != undefined) {
  //   activeLayer.className = '';
  //   //Toggle Off previous Active Layer
  //   //$('#' + activeLayer.id)
  //   //  .parent()
  //   //  .removeClass('activeLayer');
  //   $('#layerListItem' + activeLayer.id).toggleClass('activeLayerListItem');
  //   //$('#removeLayer' + activeLayer.id).css('display', 'none');
  //   $('#resizeLayer' + activeLayer.id).css('display', 'none');
  //   $('#resizeLayer' + activeLayer.id)
  //     .parent()
  //     .resizable({ disabled: true });
  //   $('#resizeLayer' + activeLayer.id)
  //     .parent()
  //     .find('.ui-rotatable-handle')
  //     .css('display', 'none');
  //   if (SAVETOHISTORY) {
  //     saveToHistory('inactive');
  //   }
  // }
  // activeLayer = {};
};

export const saveLayerPositionToHistory = () => {
  const left =
    document.getElementById(activeLayer.id).getBoundingClientRect().x -
    document.getElementById(`mainCanvasContainer`).getBoundingClientRect().x;

  const top =
    document.getElementById(activeLayer.id).getBoundingClientRect().y -
    document.getElementById(`mainCanvasContainer`).getBoundingClientRect().y;

  activeLayer.left = Math.round(left);
  activeLayer.top = Math.round(top);
  updateLayerOptionValues(activeLayer.id);
  saveToHistory('move');
};

let historyUndoStep = -1;
export let history = [];

export const cUndo = () => {
  //If Undo Step was to create layer then remove layer
  if (historyUndoStep > 0) {
    historyUndoStep--;

    console.log(`Doing Step ${historyUndoStep}`);

    let layerData = history[historyUndoStep];
    const { id, data, action, transform } = layerData;

    if (history[historyUndoStep + 1].action === 'created') {
      removeLayer(history[historyUndoStep + 1].id, false);
      if (history[historyUndoStep].action === 'init') {
        return;
      }
    }

    if (history[historyUndoStep].action === 'created') {
      moveable.target = null;
      activeLayer = null;
      return;
    }

    if (history[historyUndoStep + 1].action === 'removed') {
      showLayer(id, false);
    }
    if (action === 'removed') {
      cUndo();
      return;
    }

    if (action === 'inactive') {
      unselectAllLayers(false);
      return;
    }

    const layerIndex = (layer) => layer.id === id;
    activeLayer = layers[layers.findIndex(layerIndex)];

    document.getElementById(id).style.transform = transform;
    moveable.updateTarget();
    activeLayer = Object.assign(activeLayer, data);
    activeLayer.isActive = false;
    applyChangesToLayer(false);
    makeActive(id, false);
  }
  if (historyUndoStep === 0) {
    historyUndoStep = -1;
  }
};

export const cRedo = () => {
  if (historyUndoStep < history.length - 1) {
    historyUndoStep++;

    let layerData = history[historyUndoStep];
    const { id, data, action, transform } = layerData;

    console.log(`Doing Step ${historyUndoStep}`);
    if (action === 'init') {
      cRedo();
      return;
    }

    if (action === 'removed') {
      removeLayer(id, false);
      cRedo();
      return;
    }

    if (action === 'created') {
      showLayer(id, false);
      activeLayer = null;
      return;
    }

    if (action === 'inactive') {
      unselectAllLayers(false);
      return;
    }

    const layerIndex = (layer) => layer.id === id;
    activeLayer = layers[layers.findIndex(layerIndex)];

    document.getElementById(id).style.transform = transform;
    moveable.updateTarget();
    activeLayer = Object.assign(activeLayer, data);
    activeLayer.isActive = false;
    applyChangesToLayer(false);
    makeActive(id, false);
  }
};

export const saveToHistory = (action = '') => {
  if (history != undefined) {
    historyUndoStep++;
    //const canvas = document.getElementById(activeLayer.id);
    if (historyUndoStep < history.length) {
      history.length = historyUndoStep;
    }

    if (action === 'inactive') {
      try {
        if (history[historyUndoStep - 1].action != 'inactive') {
          history.push({
            action: action,
          });
          return;
        } else {
          historyUndoStep--;
          return;
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (action === 'template-loaded') {
      history.push({
        action: action,
      });
      return;
    }

    if (action === 'init') {
      history.push({
        action: action,
      });
      return;
    }

    if (action === 'created') {
      history.push({
        action: action,
        id: layers[layers.length - 1].id,
      });
      return;
    }

    let transform = document.getElementById(activeLayer.id).style.transform;
    transform = transform != undefined ? transform : '';

    // let layerCopy = JSON.parse(JSON.stringify(activeLayer));
    // // Reasign Content Property since it's an object and doens t
    // layerCopy.content = activeLayer.content;
    let layerCopy = {};
    layerCopy = Object.assign(layerCopy, activeLayer);

    history.push({
      action: action,
      id: activeLayer.id,
      // left: activeLayer.left,
      // top: activeLayer.top,
      // width: activeLayer.width,
      // height: activeLayer.height,
      // rotationAngle: activeLayer.rotationAngle,
      transform,
      data: layerCopy,
    });
  }
  //console.clear();
  //console.table(history);
};

saveToHistory('init');

document.addEventListener('click', () => {
  // console.clear();
  // console.table(layers);
  // layers.forEach((layer) => {
  //   console.log(
  //     `${layer.content} Color: ${layer.color} Stroke:${layer.strokeColor}`
  //   );
  // });
});

export const moveLayerTo = (x, y) => {
  const id = activeLayer.id;
  const containerDiv = document.getElementById(id).parentElement.parentElement;

  ////
  containerDiv.style.left = `${x}px`;
  containerDiv.style.top = `${y}px`;
};

export const fitToPage = (SAVE_TO_HISTORY = true) => {
  let imgWidth, imgHeight;
  const {
    id,
    width,
    height,
    contentType,

    fontSize,
    canvasRatio,
    addWidth,
    addHeight,
    qrSize,
  } = activeLayer;
  if (id) {
    if (!isWidthOrHeightEqual('mainCanvas', id)) {
      // requestStart
      document.getElementById(id).style = '';
      const box = document.getElementById('mainCanvas');
      const container = document.getElementById(id).getBoundingClientRect();
      console.table(box.width);
      const ratio = container.width / container.height;
      let tempWidth = box.width;
      let tempHeight = Math.round(tempWidth / ratio);
      if (tempHeight > box.height) {
        tempHeight = box.height;
        tempWidth = tempHeight * ratio;
      }

      // If not fit to Page already
      if (
        box.width != container.width.toFixed(0) ||
        box.height != container.height.toFixed(0)
      ) {
        moveable.request(
          'scalable',
          {
            deltaWidth: -(container.width - tempWidth),
            deltaHeight: -(container.height - tempHeight),
          },
          true
        );
      }
    }
  }
};

const isWidthOrHeightEqual = (id1, id2) => {
  const box1 = document.getElementById(id1).getBoundingClientRect();
  const box2 = document.getElementById(id2).getBoundingClientRect();

  if (
    Math.round(box1.width) === Math.round(box2.width) ||
    Math.round(box1.height) === Math.round(box2.height)
  )
    return true;
  else return false;
};

function changeScale(newScale, id) {
  const div = document.getElementById(id);
  div.style.transform = div.style.transform.replace(
    /scale\([0-9|\.]*\)/,
    'scale(' + newScale + ')'
  );
}

export const copyProperties = (layer) => {
  activeLayer = Object.assign(activeLayer, layer);
};

export const removeLayerLabels = () => {
  document
    .querySelectorAll('.layerLabel')
    .forEach((label) => (label.style.display = 'none'));
};
