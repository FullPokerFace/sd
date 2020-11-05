import { makeId } from '../../../libs/makeId.js';
import {
  createLayer,
  drawCanvas,
  makeActive,
  fitToPage,
  CL,
} from '../../../libs/canvas.js';
const addImageCollection = document.getElementById('addImageCollection');
const unsplashSearchInput = document.getElementById('unsplashSearchInput');
const unsplashImageContainer = document.getElementById(
  'unsplashImageContainer'
);
const uploadImageContainer = document.getElementById('uploadImageContainer');

const facebookImageContainer = document.getElementById(
  'facebookImageContainer'
);

const imageUpload = document.getElementById('imageUpload');

unsplashSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    unsplashImageContainer.innerHTML = '';
    unsplashPage = 1;
    loadUnsplashImages(e.srcElement.value, unsplashPage);
  }
});

///// Unsplash

let unsplashPage = 1;
const picturesPerPage = 20;
let facebookAccessToken = null;
let facebookImagesURLS = [];
let facebookPhotoPage = 1;
let libraryImageUrls = [];

const loadUnsplashImages = (query, page) => {
  const url = 'get_unsplash_images.php';
  var formData = new FormData();
  formData.append('q', query);
  formData.append('limit', picturesPerPage);
  formData.append('page', page);

  fetch(url, { method: 'POST', body: formData })
    .then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        return response.text();
      }
      throw new Error(response.statusText);
    })
    .then(function (response) {
      const data = JSON.parse(response);

      data.map((image) => {
        const source = image.urls.regular;
        const imageName = image.id;
        const img = new Image();
        img.onload = function () {
          loadImage(source, `${imageName}.jpg`, unsplashImageContainer);
        };
        img.src = source;
      });
    });
};

//Facebook

document.getElementById('facebookLogout').addEventListener('click', () => {
  console.log('Log out');
  FB.logout(function (response) {
    console.log(response);
    facebookAccessToken = null;
    console.log('Facebook log out');
  });
});

// document.getElementById('facebookLoadMore').addEventListener('click', () => {
//   facebookPhotoPage++;
//   loadFBImage(facebookImagesURLS, facebookPhotoPage);
// });

document.getElementById('loadFacebookImages').addEventListener('click', () => {
  if (!facebookAccessToken) {
    fetchFacebookImages();
  }
});

const fetchFacebookImages = () => {
  FB.login(function (response) {
    if (response.authResponse) {
      facebookAccessToken = response.authResponse.accessToken;
      console.log(facebookAccessToken);
      facebookPhotoPage = 0;
      ////

      FB.api(
        //`/me?fields=albums.limit(${picturesPerPage}){name,count,cover_photo{picture},photos.limit(${picturesPerPage}){picture,images}}`,
        `/me?fields=albums{name,count,cover_photo{picture},photos{picture,images}}`,
        (response) => {
          response.albums.data.forEach((data) => {
            data.photos.data.forEach((data) => {
              const source = data.images[0].source;
              facebookImagesURLS.push(source);
            });
          });
          loadFBImage(facebookImagesURLS, facebookPhotoPage);
        }
      );

      ////
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  });
};

// Load PDf with pdf js
const loadPDF = (file) => {
  const fileReader = new FileReader();
  fileReader.onload = function () {
    const pdfData = new Uint8Array(this.result);
    // Using DocumentInitParameters object to load binary data.
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then(
      function (pdf) {
        // Fetch the first page
        const pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
          const scale = 2;
          const viewport = page.getViewport({ scale: scale });

          // Create temporary canvas to store pdf data
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          //Set Original pdf Width & Height
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Render PDF page into canvas context
          const renderContext = {
            canvasContext: context,
            background: 'rgba(0,0,0,0)',
            viewport: viewport,
          };

          // Convert temporary context to url
          const renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            //Load Image with image data as URL
            const dataUrl = canvas.toDataURL();
            loadImage(dataUrl, file.name, uploadImageContainer, false);
          });
        });
      },
      function (reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  };
  fileReader.readAsArrayBuffer(file);
};

const loadFBImage = (images, page) => {
  const imageURLs = images.slice(
    page * picturesPerPage,
    page * picturesPerPage + picturesPerPage
  );
  imageURLs.map((url) => {
    const imageName = url.substring(url.length - 5);
    loadImage(url, `${imageName}.jpg`, facebookImageContainer);
  });
};

const loadImage = (src, fileName, container, addToLibrary = true) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    let imgWidth = img.naturalWidth;
    let imgHeight = img.naturalHeight;

    img.addEventListener('click', (e) => {
      addImage(
        img,
        'image',
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

    // If image is uploaded then add it to the canvas
    if (!addToLibrary) {
      addImage(
        img,
        'image',
        imgWidth,
        imgHeight,
        fileName,
        img.src,
        addToLibrary
      );
    }
  };
  img.src = src;
};

const addImage = (
  img,
  contentType,
  imgWidth,
  imgHeight,
  fileName,
  imgUrl,
  addToLibrary
) => {
  const id = makeId(5);
  CL({ id, content: img, contentType, fillColor: '#none', fileName });
  // createLayer({
  //   id,
  //   content: img,
  //   contentType,
  //   imgWidth,
  //   imgHeight,
  //   fileName,
  //   imgUrl,
  // });

  // drawCanvas();
  // makeActive(id);
  // fitToPage();
  if (addToLibrary) {
    // Add Image to Library if clicked
    const uploadContainerImage = document.createElement('img');
    uploadContainerImage.src = img.src;
    uploadContainerImage.addEventListener('click', (e) => {
      addImage(img, 'image', imgWidth, imgHeight, fileName, img.src, false);
    });
    const li = document.createElement('LI');
    li.appendChild(uploadContainerImage);
    uploadImageContainer.appendChild(li);
  }
};

addImageCollection.addEventListener('scroll', () => {
  let divHeight = addImageCollection.scrollHeight;
  let scrollBottom =
    addImageCollection.scrollTop + addImageCollection.offsetHeight;

  if (scrollBottom - divHeight >= 0) {
    const activeTabId = document.querySelector('.collectionTab.active').id;
    if (activeTabId === 'galleryTab') {
      const unsplashSearchQuery = unsplashSearchInput.value;
      unsplashPage++;
      loadUnsplashImages(unsplashSearchQuery, unsplashPage);
    }
    if (activeTabId === 'facebookTab') {
      facebookPhotoPage++;
      loadFBImage(facebookImagesURLS, facebookPhotoPage);
    }
  }
});

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file.type == 'application/pdf') {
    loadPDF(file);
  } else {
    loadImage(
      URL.createObjectURL(file),
      file.name,
      uploadImageContainer,
      false
    );
  }
});
