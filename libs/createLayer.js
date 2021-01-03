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