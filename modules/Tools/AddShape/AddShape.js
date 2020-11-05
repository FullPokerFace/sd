import { makeId } from '../../../libs/makeId.js';
import {
  createLayer,
  drawCanvas,
  makeActive,
  fitToPage,
  CL,
} from '../../../libs/canvas.js';

import { moveable } from '../../Init.js';

///// Flaticon

let flaticonPage = 1;
const picturesPerPage = 20;

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
    });

  // var data = 'apikey=6f62f8c8ed2f45eab29ac3db296515668e60090c';

  // var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  // xhr.addEventListener('readystatechange', function () {
  //   if (this.readyState === 4) {
  //     flaticonAccessToken = JSON.parse(this.responseText).data.token; //TODO check if Access Token already exists
  //     ////
  //     var data = null;

  //     var xhr = new XMLHttpRequest();
  //     xhr.withCredentials = true;

  //     xhr.addEventListener('readystatechange', function () {
  //       if (this.readyState === 4) {
  //         data = JSON.parse(this.responseText).data;
  //         data.map((data) => {
  //           let src = data.images.svg;
  //           const imageName = `${data.id}.svg`;
  //           loadImage(src, imageName, flaticonImageContainer, true);
  //         });
  //       }
  //     });

  //     xhr.open(
  //       'GET',
  //       `https://api.flaticon.com/v2/search/icons/priority?q=${query}&page=${flaticonPage}&limit=${picturesPerPage}`
  //     );
  //     xhr.setRequestHeader('accept', 'application/json');
  //     xhr.setRequestHeader('authorization', `Bearer  ${flaticonAccessToken}`);

  //     xhr.send(data);

  //     ////
  //   }
  // });

  // xhr.open('POST', 'https://api.flaticon.com/v2/app/authentication');
  // xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
  // xhr.setRequestHeader('accept', 'application/json');

  // xhr.send(data);
};

export const loadImage = (src, fileName, container, addToLibrary = true) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
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

    //img.click();
    const li = document.createElement('LI');
    li.appendChild(img);
    container.appendChild(li);
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

  //makeActive(id);

  //   let fillColor = '';
  //   $.get(
  //     imgUrl,
  //     (svgData) => {
  //       //console.table(svg);

  //       var regex = /fill="/gi,
  //         result,
  //         indices = [];
  //       while ((result = regex.exec(svgData))) {
  //         indices.push(result.index);
  //       }

  //       if (indices.length > 0) {
  //         fillColor = 'restricted';
  //       }

  //     },
  //     'text'
  //   );

  // createLayer({
  //   id,
  //   content: img,
  //   contentType,
  //   imgWidth,
  //   imgHeight,
  //   fileName,
  //   imgUrl: imgUrl,
  //   fillColor: '#none',
  // });

  // drawCanvas();
  // makeActive(id);
  // fitToPage();

  if (addToLibrary === true) {
    // Add Image to Library if clicked
    const uploadContainerImage = document.createElement('img');
    uploadContainerImage.src = img.src;
    uploadContainerImage.addEventListener('click', (e) => {
      addImage(img, 'shape', imgWidth, imgHeight, fileName, false);
    });
    const li = document.createElement('LI');
    li.appendChild(uploadContainerImage);
    uploadImageContainer.appendChild(li);
  }
};

flatIconSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    flaticonPage = 1;
    flaticonImageContainer.innerHTML = '';
    loadFlaticonImages(e.srcElement.value, flaticonPage);
  }
});

addShapeCollection.addEventListener('scroll', () => {
  let divHeight = addShapeCollection.scrollHeight;
  let scrollBottom =
    addShapeCollection.scrollTop + addShapeCollection.offsetHeight;

  if (scrollBottom - divHeight >= 0) {
    const activeTabId = document.querySelector('.collectionTab.active').id;
    if (activeTabId === 'shapeTab') {
      const query = flatIconSearchInput.value;
      flaticonPage++;
      loadFlaticonImages(query, flaticonPage);
    }
  }
});
