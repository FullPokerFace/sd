import { makeId } from '../../../libs/makeId.js';
import {
  createLayer,
  drawCanvas,
  makeActive,
  fitToPage,
  CL,
} from '../../../libs/canvas.js';

const addQrButton = document.getElementById('addQrButton');
const QRCodeContentInput = document.getElementById('QRCodeContentInput');

addQrButton.addEventListener('click', () => {
  const id = makeId(5);
  const content = `${QRCodeContentInput.value}`;
  const imgWidth = 200;
  const imgHeight = 200;
  CL({
    id,
    content,
    contentType: 'qr',
    fileName: content,
  });
  // createLayer({
  //   id,
  //   content,
  //   contentType: 'qr',
  //   imgWidth,
  //   imgHeight,
  // });
  // drawCanvas();
  // makeActive(id);
});
