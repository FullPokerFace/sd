
// Tab Navigation 
const tabHeaders = document.querySelectorAll('.tab-header');
tabHeaders.forEach((tabHeader)=>{
    tabHeader.addEventListener('click', (e)=>{
        e.stopPropagation();
        document.querySelector('.active-tab-header').classList.remove('active-tab-header');
        e.target.classList.add('active-tab-header');
        document.querySelector(`.active-tab`).classList.remove('active-tab');
        document.querySelector(`#${e.target.id}-tab`).classList.add('active-tab');
    })
})

// Fix ViewHeight for Safari iOS
const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  

