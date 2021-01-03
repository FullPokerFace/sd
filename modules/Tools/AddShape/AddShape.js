import { makeId } from '../../../libs/makeId.js';
import {

  drawCanvas,
  makeActive,
  fitToPage,
  CL,
} from '../../../libs/canvas.js';

import { moveable } from '../../Init.js';

///// Flaticon

let flaticonPage = 1;
const picturesPerPage = 20;
let isLoading = false;

const flaticonImageContainer = document.getElementById(
  'flaticonImageContainer'
);
const flatIconSearchInput = document.getElementById('flatIconSearchInput');
const uploadImageContainer = document.getElementById('uploadImageContainer');
const addShapeCollection = document.getElementById('addShapeCollection');


const loadFlaticonImages = (query, page) => {
  const url = 'get_flaticon_images.php';
  var formData = new FormData();
  formData.append('q', query);
  formData.append('limit', picturesPerPage);
  formData.append('page', flaticonPage);

  fetch(url, { method: 'POST', body: formData })
    .then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        return response.text();
      }
      throw new Error(response.statusText);
    })
    .then(function (response) {
      const data = JSON.parse(response);
      data.map((data) => {
        let src = data.images.svg;
        const imageName = `${data.id}.svg`;
        loadImage(src, imageName, flaticonImageContainer, true);
      });
      isLoading = false;
    });

};

export const loadImage = (src, fileName, container, addToLibrary = true) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.style.width = '100%';
  img.onload = function () {
    let imgWidth = img.naturalWidth;
    let imgHeight = img.naturalHeight;

    img.addEventListener('click', (e) => {
      addImage(
        img,
        'shape',
        imgWidth,
        imgHeight,
        fileName,
        img.src,
        addToLibrary
      );
    });
    const div = document.createElement('DIV');
    div.appendChild(img);
    smallestCol(container).appendChild(div);
  };

  img.src = src;
};

export const addImage = (
  img,
  contentType,
  imgWidth,
  imgHeight,
  fileName,
  imgUrl,
  addToLibrary
) => {
  const id = makeId(5);

  if (contentType === 'shape') {
    var url = 'get_svg_data.php';
    var formData = new FormData();
    formData.append('path', img.src);

    fetch(url, { method: 'POST', body: formData })
      .then(function (response) {
        return response.text();
      })
      .then(function (body) {
        CL({ id, content: body, contentType, fillColor: '#none', fileName });
      });
  }



  if (addToLibrary === true) {
    // Add Image to Library if clicked
    const uploadContainerImage = document.createElement('img');
    uploadContainerImage.src = img.src;
    uploadContainerImage.addEventListener('click', (e) => {
      addImage(img, 'shape', imgWidth, imgHeight, fileName, false);
    });
    const div = document.createElement('DIV');
    div.appendChild(uploadContainerImage);
    uploadImageContainer.appendChild(div);
  }
};

flatIconSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    flaticonImageContainer.querySelectorAll('div').forEach(div => {
      div.innerHTML = '';
    })
    flaticonPage = 1;
    loadFlaticonImages(e.target.value, flaticonPage);
  }
});

addShapeCollection.addEventListener('scroll', () => {
  let divHeight = addShapeCollection.scrollHeight;
  let scrollBottom =
    addShapeCollection.scrollTop + addShapeCollection.offsetHeight;

  if (scrollBottom - divHeight >= -100 && !isLoading) {
    const query = flatIconSearchInput.value;
    flaticonPage++;
    loadFlaticonImages(query, flaticonPage);
    isLoading = true;
    // const activeTabId = document.querySelector('.collectionTab.active').id;
    // if (activeTabId === 'shapeTab') {
    //   const query = flatIconSearchInput.value;
    //   flaticonPage++;
    //   loadFlaticonImages(query, flaticonPage);
    // }
  }
});


const smallestCol = (container) => {
  const cols = [ ...container.children];
  return cols.reduce((firstCol, col) => {
    return col.clientHeight < firstCol.clientHeight ? col : firstCol;
  }, cols[0])
}