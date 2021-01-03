import { makeId } from '../../../libs/makeId.js';
import {

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


  gFontsList
    .slice(page * fontCount, page * fontCount + fontCount)
    .map((font, index) => {
      loadedFontsLink += `family=${font.family.split(' ').join('+')}&`;

      // Adding Font to Font Option
      let option = document.createElement('option');
      option.text = font.family;
      option.style.fontFamily = font.family;
      fontFamilySelect.add(option);

      // Adding font font collection
      //const fontLI = document.createElement('a');
      const fontSpan = document.createElement('a');
      fontSpan.classList.add('dropdown-item');
      fontSpan.classList.add('fontSample');
      fontSpan.style.fontFamily = font.family;
      fontSpan.innerHTML = `${fontPage*100+index} ${font.family}`;
      //fontLI.appendChild(fontSpan);
      fontList.appendChild(fontSpan);
      fontSpan.addEventListener('click', (e) => {
        const id = makeId(5);

        CL({
          id,
          content: font.family,
          contentType: 'text',
          fontFamily: font.family,
          fileName: '',
        });
      });

    });


  const link = document.getElementById('fontsLink');
  link.href = `https://fonts.googleapis.com/css2?${loadedFontsLink}display=swap`;

  fontPage++;
};



addTextCollection.addEventListener('scroll', () => {
  let divHeight = addTextCollection.scrollHeight;
  let scrollBottom =
    addTextCollection.scrollTop + addTextCollection.offsetHeight;


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
