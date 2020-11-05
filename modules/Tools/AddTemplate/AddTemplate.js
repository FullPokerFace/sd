import {
  layers,
  unselectAllLayers,
  removeLayerLabels,
  CL,
} from '../../../libs/canvas.js';
import { makeId } from '../../../libs/makeId.js';
import { bgHex } from '../../../modules/drawingArea.js';

import { setColor, setSize } from '../../drawingArea.js';
import { closeDialogues } from '../../../ui-interactions.js';

const templateContainer = document.getElementById('templateContainer');
const saveTemplateButton = document.getElementById('saveTemplateButton');

const mainCanvas = document.getElementById('mainCanvas');
const templateTagsInput = document.getElementById('templateTagsInput');
const mainCtx = mainCanvas.getContext('2d');
const mainCanvasContainer = document.getElementById('mainCanvasContainer');

saveTemplateButton.addEventListener('click', () => {
  saveTemplate();
});

const saveTemplate = () => {
  removeLayerLabels();
  unselectAllLayers();
  closeDialogues();

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

  usedFontsLink.onload = () => {
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
          placeholder: 'Template name or tags',
          callback: (templateName) => {
            if (templateName) {
              const fileName = `${templateName} ${makeId(5)}`;
              const backGround = {
                contentType: 'bg',
                bgColor: bgHex,
                bgWidth: mainCanvas.width,
                bgHeight: mainCanvas.height,
                isVisible: true,
              };

              layers.push(backGround);

              layers.sort((a, b) =>
                a.zIndex > b.zIndex ? 1 : b.zIndex > a.zIndex ? -1 : 0
              );

              let layerJSON = JSON.stringify(
                layers.filter((e) => e.isVisible === true)
              );
              layers.pop();

              const url = 'saveTemplate.php';
              var formData = new FormData();

              formData.append('imgBase64', dataUrl);
              formData.append('layerJSON', layerJSON);
              formData.append('fileName', fileName);

              fetch(url, { method: 'POST', body: formData })
                .then(function (response) {
                  if (response.status >= 200 && response.status < 300) {
                    return response.text();
                  }
                  throw new Error(response.statusText);
                })
                .then(function (response) {
                  loadTemplateImage(
                    `${location.href}/templates/${fileName}.png`,
                    templateContainer
                  );
                });

              mainCtx.fillStyle = bgHex;
              mainCtx.fillRect(
                0,
                0,
                mainCtx.canvas.width,
                mainCtx.canvas.height
              );
            }
            document.head.appendChild(originalFonts);
            usedFontsLink.remove();
          },
        });
      })
      .catch(function (error) {
        console.error('Image Generating Error - Please try again', error);
      });
  };
};

const loadTemplateImage = (src, container) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    img.addEventListener('click', (e) => {
      loadTemplate(src);
    });
    const li = document.createElement('LI');
    li.appendChild(img);
    container.appendChild(li);
  };
  img.src = src;
};

export const loadTemplate = (url) => {
  if (url) {
    let requestURL = url.replace('.png', '.json');

    fetch(requestURL, {
      method: 'GET',
    })
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          return response.text();
        }
        throw new Error(response.statusText);
      })
      .then((response) => {
        const loadedDesign = JSON.parse(response);
        loadedDesign.map((layer) => {
          layer.id = makeId(5);
          if (layer.contentType === 'image') {
            const img = new Image();
            img.src = layer.imgUrl;
            img.onload = () => {};
            layer.content = img;
            CL({}, layer);
          } else if (layer.contentType === 'bg') {
            setSize(mainCanvas, layer.bgWidth, layer.bgHeight);
            setColor(mainCanvas, layer.bgColor);
          } else {
            CL({}, layer);
          }
        });
      });
  }
};

templateTagsInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    templateContainer.innerHTML = '';

    fetch('getTemplateList.php', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        data.map((template) => {
          if (
            template
              .toLowerCase()
              .includes(templateTagsInput.value.toLowerCase())
          ) {
            loadTemplateImage(
              `${location.href}/${template}`,
              templateContainer
            );
          }
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});

//loadTemplate('https://site.test/SignDesigner//templates/all HUyzN.png');
