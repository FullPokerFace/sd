import { makeId } from '../../../libs/makeId.js';
import {
  createLayer,
  drawCanvas,
  makeActive,
  CL,
} from '../../../libs/canvas.js';

const fontContainer = document.getElementById('fontContainer');
const fontList = document.getElementById('fontList');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const addTextCollection = document.getElementById('addTextCollection');

///
const fontsLink = document.createElement('link');
fontsLink.id = 'fontsLink';
document.head.appendChild(fontsLink);
fontsLink.rel = 'stylesheet';
fontsLink.setAttribute('crossorigin', 'anonymous');

export let fontPage = 0;
let fontCount = 100;
let loadedFontsLink = '';

// fontContainer.addEventListener('click', () => {
//   fontContainer.innerHTML = '';
//   loadGFonts(fontPage);
// });

let gFontsList = [];

export const initGFonts = () => {
  $.ajax({
    type: 'POST',
    url: 'getGoogleFontsList.php',
    success: function (data) {
      gFontsList = JSON.parse(data).items;
      addGFontsToPage(fontPage);
    },
  });
};

const addGFontsToPage = (page) => {
  //const fontToLoadList =

  gFontsList
    .slice(page * fontCount, page * fontCount + fontCount)
    .map((font, index) => {
      loadedFontsLink += `family=${font.family.split(' ').join('+')}&`;

      let option = document.createElement('option');
      option.text = font.family;
      option.style.fontFamily = font.family;
      fontFamilySelect.add(option);
      const fontLI = document.createElement('li');
      const fontSpan = document.createElement('span');
      fontSpan.classList.add('fontSample');
      fontSpan.style.fontFamily = font.family;
      fontSpan.innerHTML = font.family;
      fontLI.appendChild(fontSpan);
      fontList.appendChild(fontLI);
      fontLI.addEventListener('click', (e) => {
        const id = makeId(5);

        CL({
          id,
          content: font.family,
          contentType: 'text',
          fontFamily: font.family,
          fileName: '',
        });
      });
      //if (index % 3 === 0) fontLI.click();
    });

  // WebFont.load({
  //   google: { families: fontToLoadList },
  // });
  const link = document.getElementById('fontsLink');
  link.href = `https://fonts.googleapis.com/css2?${loadedFontsLink}display=swap`;

  fontPage++;
};

// export const loadGFonts = (page) => {
//   //////
//   const fontFamilySelect = document.getElementById('fontFamilySelect');
//   var data = null;
//   let fontToLoadList = [];
//   let fontsWithWeightToLoad = [];

//   var xhr = new XMLHttpRequest();
//   //xhr.withCredentials = '';

//   xhr.addEventListener('readystatechange', function () {
//     if (this.readyState === 4) {
//       let fonts = JSON.parse(this.responseText).items.slice(
//         page * fontCount,
//         page * fontCount + fontCount
//       );

//       fonts.map((font) => {
//         let fontToLoad = `${font.family}`;
//         let fontWeight = `:${font.variants[0]}`;
//         ////
//         fontsWithWeightToLoad.push(`${fontToLoad}${fontWeight}`);
//         fontToLoadList.push(fontToLoad);
//         ///
//       });

//       WebFont.load({
//         google: { families: fontToLoadList },
//       });

//       (function () {
//         var wf = document.createElement('script');
//         wf.src =
//           ('https:' == document.location.protocol ? 'https' : 'http') +
//           '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
//         wf.type = 'text/javascript';
//         wf.async = 'true';
//         var s = document.getElementsByTagName('script')[0];
//         s.parentNode.insertBefore(wf, s);
//         /////
//         fontToLoadList.map((font) => {
//           var option = document.createElement('option');
//           option.text = font;
//           option.style.fontFamily = font;
//           fontFamilySelect.add(option);

//           const fontLI = document.createElement('li');
//           const fontSpan = document.createElement('span');
//           fontSpan.classList.add('fontSample');
//           fontSpan.style.fontFamily = font;
//           fontSpan.innerHTML = font;
//           fontLI.appendChild(fontSpan);
//           fontList.appendChild(fontLI);
//           fontLI.addEventListener('click', (e) => {
//             const newLayerId = makeId(5);
//             createLayer({
//               id: newLayerId,
//               content: font,
//               contentType: 'text',
//               fontFamily: font,
//             });
//             drawCanvas(false);
//             makeActive(newLayerId);
//             e.stopPropagation();
//           });
//         });
//         ///
//       })();
//       fontPage++;
//     }
//   });

//   let gFontsApiKey = 'AIzaSyBwNG5tyqOuXWs-QFMEcM10AxxEV1aKoYk';
//   xhr.open(
//     'GET',
//     `https://www.googleapis.com/webfonts/v1/webfonts?key=${gFontsApiKey}&sort=popularity`
//   );
//   xhr.setRequestHeader('content-type', 'Content-Type: application/json');
//   xhr.setRequestHeader('cache-control', 'no-cache');

//   xhr.send(data);
// };

addTextCollection.addEventListener('scroll', () => {
  let divHeight = addTextCollection.scrollHeight;
  let scrollBottom =
    addTextCollection.scrollTop + addTextCollection.offsetHeight;

  console.log(fontCount < gFontsList.length);
  if (scrollBottom - divHeight >= 0) {
    if (fontCount < gFontsList.length) addGFontsToPage(fontPage);
  }
});

initGFonts();

// let id = makeId(5);
// CL({
//   id,
//   content: 'Sample\r\nText',
//   contentType: 'text',
//   fontFamily: 'Arial',
//   rotationAngle: -20,
//   fileName: '',
// });
