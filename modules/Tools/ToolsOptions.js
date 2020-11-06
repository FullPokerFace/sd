import { fontPage, initGFonts } from './AddText/AddText.js';
import './AddImage/AddImage.js';
import './AddQr/AddQR.js';
import './AddShape/AddShape.js';
import './AddTemplate/AddTemplate.js';

export const tabs = document.querySelectorAll('.collectionTab');
export const tools = document.querySelectorAll('.tool');
const toolsOption = document.querySelector('.toolsOption');
const closeTabs = document.querySelectorAll('.closeTab');

const addText = document.getElementById('addText');

tabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    //Turn Off Previously Active Tab
    document.querySelector('.collectionTab.active').classList.remove('active');
    //Turn On this Tab
    tab.classList.add('active');
    //Hide All Tabs Content
    const tabAreas = document.querySelectorAll('.tabContent');
    tabAreas.forEach((el) => {
      el.style.display = 'none';
    });
    //Display this tab content
    const activeTabContent = document.querySelector(
      `#${event.srcElement.id}Content`
    );
    if (activeTabContent) {
      activeTabContent.style.display = 'block';
    }
    event.stopPropagation();
  });
});

tools.forEach((tool) => {
  tool.addEventListener('click', (event) => {
    toolsOption.style.display = 'block';
    event.stopPropagation();
    //Turn Off Previously Active Tab
    if (document.querySelector('.tool.active')) {
      document.querySelector('.tool.active').classList.remove('active');
    }
    //Turn On this Tab
    tool.classList.add('active');

    ///
    const collections = document.querySelectorAll('.collection');
    collections.forEach((el) => {
      el.style.display = 'none';
    });
    //Display this tab content

    const activeCollection = document.querySelector(
      `#${event.srcElement.parentElement.id}Collection`
    );
    if (activeCollection) {
      activeCollection.querySelector('.collectionTab').click();
      activeCollection.style.display = 'block';
    }
  });
});

closeTabs.forEach((closeTab) => {
  closeTab.addEventListener('click', (event) => {
    event.srcElement.parentElement.style.display = 'none';
  });
});

// Shapes;
// document.getElementById('addShape').click();
// document.getElementById('addShapeCollection').style.display = 'block';
// document.getElementById('shapeTab').click();
// document.getElementById('flatIconSearchInput').value = 'flower';
// document
//   .getElementById('flatIconSearchInput')
//   .dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));

// Images;
// document.getElementById('addImage').click();
// document.getElementById('addImageCollection').style.display = 'block';
// document.getElementById('galleryTab').click();
// document.getElementById('unsplashSearchInput').value = 'mountain';
// document
//   .getElementById('unsplashSearchInput')
//   .dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));

//    Templates
// document.getElementById('addTemplate').click();
// document.getElementById('addTemplateCollection').style.display = 'block';
// document.getElementById('templateTab').click();
// document.getElementById('templateTagsInput').value = ' ';
// document
//   .getElementById('templateTagsInput')
//   .dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));

// addText.addEventListener('click', () => {});
