import {
  layers,
} from '../libs/canvas.js';

export const getInitOptions = new Promise((resolve, reject) => {
  let requestURL = './initOptions/products123.json';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  let initOptions = '';
  request.onload = function () {
    initOptions = request.response;
    if (initOptions != '') {
      resolve(initOptions);
    } else reject('Failed');
  };

  //return initOptions;
});

export const moveable = new Moveable(document.querySelector('.drawingArea'), {
  draggable: true,
  rotatable: true,
  warpable: false,
  resizable: false,
  keepRatio: true,
  scalable: true,
  snappable: true,
  pinchable: true,
  padding: { left: 0, top: 0, right: 0, bottom: 0 },
  throttleRotate: 5,
  zoom: 2,
});



moveable.snapCenter = true;

moveable.on('drag', ({ target, transform }) => {
  target.style.transform = transform;
});

moveable.on('resize', ({ target, width, height }) => {
  target.style.width = width + 'px';
  target.style.height = height + 'px';
});

moveable.on('scale', ({ target, transform }) => {
  target.style.transform = transform;
});

moveable.on('rotate', ({ target, transform }) => {
  target.style.transform = transform;
});

moveable.on('warp', ({ target, transform }) => {
  target.style.transform = transform;
});



const  options = {
  group: 'share',
  animation: 100
};

const events = [
  'onEnd',
].forEach(function (name) {
  options[name] = function (evt) {
    const layerListItems = Array.from(document.getElementById('layerList').childNodes).reverse();
    let newIndex = 100;
    layerListItems.map((item) => {
    const id = item.id !== undefined ? item.id.replace('layerListItem', '') : null;
      if (id) {
        const layerIndex = (layer) => layer.id === id;
        layers[layers.findIndex(layerIndex)].zIndex = newIndex;
        document.getElementById(id).style.zIndex = newIndex;

        newIndex++; 
      }
    })
}});

Sortable.create(layerList, options);


