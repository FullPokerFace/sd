import {
  layers,
  activeLayer,
  fitToPage,
  duplicateLayer,
  drawCanvas,
  unselectAllLayers,
  cUndo,
  cRedo,
  history,
  removeLayerLabels,
  saveLayerPositionToHistory,
} from '../libs/canvas.js';
import { bgHex } from '../modules/drawingArea.js';
import { makeId } from '../libs/makeId.js';
import { moveable } from './Init.js';

const printButton = document.getElementById('printButton');
const downloadButton = document.getElementById('downloadButton');
const shareOnFacebookButton = document.getElementById('shareOnFacebookButton');
const alignLeftButton = document.getElementById('alignLeftButton');
const alignRightButton = document.getElementById('alignRightButton');
const alignCenterButton = document.getElementById('alignCenterButton');
const alignTopButton = document.getElementById('alignTopButton');
const alignBottomButton = document.getElementById('alignBottomButton');
const fitToPageButton = document.getElementById('fitToPageButton');
const duplicateLayerButton = document.getElementById('duplicateLayerButton');
const flipHorizontalButton = document.getElementById('flipHorizontalButton');
const flipVerticalButton = document.getElementById('flipVerticalButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');
const mainCanvasContainer = document.getElementById('mainCanvasContainer');
let facebookAccessToken = 0;

printButton.addEventListener('click', () => {
  const fonts = usedFontsLink();
  fonts.usedFontsLink.onload = () => {
    domtoimage
      .toPng(mainCanvasContainer, {
        width: mainCanvas.width,
        height: mainCanvas.height,
      })
      .then((dataUrl) => {
        printJS({
          printable: dataUrl,
          type: 'image',
          imageStyle: 'width:100%',
        });
        mainCtx.fillStyle = bgHex;
        mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
        document.head.appendChild(fonts.originalFonts);
        fonts.usedFontsLink.remove();
      })
      .catch(function (error) {
        console.error('Image Generating Error - Please try again', error);
      });
  };
});

const usedFontsLink = () => {
  removeLayerLabels();
  unselectAllLayers();

  let fontsToRender = '';
  layers.map((layer) => {
    if (layer.contentType === 'text')
      fontsToRender += `family=${layer.fontFamily.split(' ').join('+')}&`;
  });

  const usedFontsLink = document.createElement('link');
  document.head.appendChild(usedFontsLink);
  usedFontsLink.rel = 'stylesheet';
  usedFontsLink.setAttribute('crossorigin', 'anonymous');
  usedFontsLink.href =
    fontsToRender != ''
      ? `https://fonts.googleapis.com/css2?${fontsToRender}display=swap`
      : '#';

  const fontsLink = document.getElementById('fontsLink');
  const originalFonts = fontsLink.cloneNode();
  fontsLink.remove();
  return { usedFontsLink: usedFontsLink, originalFonts: originalFonts };
};

downloadButton.addEventListener('click', () => {
  const fonts = usedFontsLink();
  fonts.usedFontsLink.onload = () => {
    domtoimage
      .toPng(mainCanvasContainer, {
        width: mainCanvas.width,
        height: mainCanvas.height,
      })
      .then(function (dataUrl) {
        const previewImage = new Image();
        previewImage.src = dataUrl;
        previewImage.style.width = '100%';
        vex.dialog.buttons.YES.text = 'Save';
        vex.dialog.prompt({
          unsafeMessage: previewImage,
          placeholder: 'Image Name',
          callback: (imageName) => {
            if (imageName) {
              const link = document.createElement('a');
              imageName = imageName != '' ? imageName : 'image';
              link.download = `${imageName}.png`;
              link.href = previewImage.src;
              document.body.appendChild(link);
              link.click();
              link.remove();
              mainCtx.fillStyle = bgHex;
              mainCtx.fillRect(
                0,
                0,
                mainCtx.canvas.width,
                mainCtx.canvas.height
              );
            }
            document.head.appendChild(fonts.originalFonts);
            fonts.usedFontsLink.remove();
          },
        });
      })
      .catch(function (error) {
        console.error('Image Generating Error - Please try again', error);
      });
  };
});

const createPostToFacebookForm = (pageList, dataUrl) => {
  const div = document.createElement('div');
  div.method = 'post';
  div.id = 'postToFacebookForm';
  const label = document.createElement('span');
  label.innerHTML = 'Post to: ';
  label.style.width = '20%';
  label.style.padding = '0px 2% ';
  const select = document.createElement('select');
  select.className = 'selectInput';
  select.id = 'facebookPageSelect';
  select.style.width = '76%';

  pageList.map((page) => {
    const option = document.createElement('option');
    option.value = page.access_token;
    option.innerHTML = page.name;
    select.appendChild(option);
  });

  const img = new Image();
  img.src = dataUrl;
  img.style.width = '100%';

  //div.appendChild(textarea);
  div.appendChild(img);
  div.appendChild(label);
  div.appendChild(select);
  return div.innerHTML;
};

const facebookShareDialog = (dataUrl, shareLink) => {
  FB.api('/me/accounts', 'GET', { fields: 'name,access_token' }, function (
    response
  ) {
    const page_id = response.data[0].id;
    const html = createPostToFacebookForm(response.data, dataUrl);
    vex.dialog.buttons.YES.text = 'Post';
    vex.dialog.prompt({
      placeholder: 'Caption',
      unsafeMessage: html,
      callback: (caption) => {
        if (caption) {
          const pageId = document.getElementById('facebookPageSelect').options[
            document.getElementById('facebookPageSelect').selectedIndex
          ].value;
          vex.dialog.buttons.YES.text = 'Ok';
          vex.dialog.alert('Working on it...');

          FB.api(
            `/${page_id}/photos`,
            'POST',
            {
              caption,
              access_token: pageId,
              url:
                'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', //shareLink,
            },
            function (response) {
              vex.closeAll();
              if (response.error) {
                vex.dialog.alert(response.error.message);
              } else {
                vex.dialog.alert('All Done!');
              }
            }
          );
        }
      },
    });
  });
};

shareOnFacebookButton.addEventListener('click', () => {
  const fonts = usedFontsLink();
  fonts.usedFontsLink.onload = () => {
    domtoimage
      .toPng(mainCanvasContainer, {
        width: mainCanvas.width,
        height: mainCanvas.height,
      })
      .then((dataUrl) => {
        const fileName = makeId(10);

        const url = 'photo_upload.php';
        var formData = new FormData();

        formData.append('imgBase64', dataUrl);
        formData.append('fileName', fileName);

        fetch(url, { method: 'POST', body: formData })
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.text();
            }
            throw new Error(response.statusText);
          })
          .then((response) => {
            const shareLink = `${window.location.href}/uploads/${fileName}.png`;
            if (!facebookAccessToken) {
              FB.login((response) => {
                if (response.authResponse) {
                  facebookAccessToken = response.authResponse.accessToken;
                  facebookShareDialog(dataUrl, shareLink);
                }
              });
            } else {
              facebookShareDialog(dataUrl, shareLink);
            }

            mainCtx.fillStyle = bgHex;
            mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
            document.head.appendChild(fonts.originalFonts);
            fonts.usedFontsLink.remove();
          });
      });
  };
});

export const alignLayer = (alignment) => {
  if (activeLayer != null) {
    const mainCanvasRect = document
      .getElementById('mainCanvas')
      .getBoundingClientRect();
    const container = document
      .getElementById(activeLayer.id)
      .getBoundingClientRect();
    const tools = document.querySelector('.tools').getBoundingClientRect();
    const topMenu = document.querySelector('.topMenu').getBoundingClientRect();
    if (activeLayer) {
      switch (alignment) {
        ///
        case 'left':
          if (Math.floor(container.left) != Math.floor(mainCanvasRect.left)) {
            moveable.request(
              'draggable',
              { x: mainCanvasRect.left - tools.width },
              true
            );
          } else {
            return;
          }

          break;
        ///
        case 'top':
          if (Math.floor(container.top) != Math.floor(mainCanvasRect.top)) {
            moveable.request(
              'draggable',
              { y: mainCanvasRect.top - topMenu.height },
              true
            );
          } else {
            return;
          }

          break;

        ///
        case 'right':
          if (Math.floor(container.right) != Math.floor(mainCanvasRect.right)) {
            moveable.request(
              'draggable',
              { x: mainCanvasRect.right - container.width - tools.width },
              true
            );
          } else {
            return;
          }

          break;

        ///
        case 'bottom':
          if (
            Math.floor(container.bottom) != Math.floor(mainCanvasRect.bottom)
          ) {
            moveable.request(
              'draggable',
              { y: mainCanvasRect.bottom - container.height - topMenu.height },
              true
            );
          } else {
            return;
          }

          break;

        ///
        case 'center':
          const x = (
            mainCanvasRect.left +
            mainCanvasRect.width / 2 -
            container.width / 2 -
            tools.width
          ).toFixed(0);
          const y = (
            mainCanvasRect.top +
            mainCanvasRect.height / 2 -
            container.height / 2 -
            topMenu.height
          ).toFixed(0);

          //    If not in the middle already
          if (
            container.left.toFixed(0) - tools.width != x &&
            container.top.toFixed(0) - topMenu.height != y
          ) {
            moveable.request(
              'draggable',
              {
                x,
                y,
              },
              true
            );
            return;
          }

          break;
      }
      moveable.updateTarget();
    }
  }
};

alignLeftButton.addEventListener('click', () => {
  alignLayer('left');
});

alignRightButton.addEventListener('click', () => {
  alignLayer('right');
});

alignTopButton.addEventListener('click', () => {
  alignLayer('top');
});

alignBottomButton.addEventListener('click', () => {
  alignLayer('bottom');
});

alignCenterButton.addEventListener('click', () => {
  alignLayer('center');
});

fitToPageButton.addEventListener('click', () => {
  if (activeLayer != null) {
    fitToPage();
    alignLayer('center');
  }
});

duplicateLayerButton.addEventListener('click', () => {
  duplicateLayer();
});

const flipEl = () => {
  const scaleX = activeLayer.flipHorizontal ? '-1' : '1';
  const scaleY = activeLayer.flipVertical ? '-1' : '1';
  const el = document.getElementById(activeLayer.id).firstChild;
  el.style.transform = `scale(${scaleX}, ${scaleY})`;
  activeLayer.childCssText = el.style.cssText;
};

flipHorizontalButton.addEventListener('click', () => {
  activeLayer.flipHorizontal = !activeLayer.flipHorizontal;
  flipEl();
});
flipVerticalButton.addEventListener('click', () => {
  activeLayer.flipVertical = !activeLayer.flipVertical;
  flipEl();
});

undoButton.addEventListener('click', () => {
  cUndo();
});

redoButton.addEventListener('click', () => {
  cRedo();
});


//  DEBUGGING

// document.getElementById('showLayersButton').addEventListener('click', () => {
//   console.log('Layers');
//   console.table(layers);
// });
// document.getElementById('showHistoryButton').addEventListener('click', () => {
//   console.log('History');
//   console.table(history);
// });

// document.getElementById('testButton').addEventListener('click', () => {
//   // const recoveredDesign = JSON.stringify(layers);
//   // localStorage.setItem('recoveredDesign', recoveredDesign);
//   // console.log(recoveredDesign);
// });

// document.getElementById('testButton').addEventListener('dblclick', () => {
//   const visibleLayers = layers.filter((layer) => layer.isVisible === true);
//   console.log(visibleLayers.length != 0);
// });
