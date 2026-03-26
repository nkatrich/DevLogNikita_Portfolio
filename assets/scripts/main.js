import { translations } from "./translations.js";

// vars
    // DOM vars
    const body = document.body;
    const header = document.querySelector('.header');
    const listOfSkills = document.querySelectorAll('.list-of-skills');
    const slider = document.querySelectorAll('.slider');
    const sliderBtnLeftProjects = document.querySelector('.slider-btn-left-projects');
    const sliderBtnRightProjects = document.querySelector('.slider-btn-right-projects');
    const sliderBtnLeftCertificates = document.querySelector('.slider-btn-left-certificates');
    const sliderBtnRightCertificates = document.querySelector('.slider-btn-right-certificates');
    const divAboutMe = document.querySelector('h1');
    const divImgAboutMe = document.querySelector('.div-img-about-me');
    const decorGreeting = document.querySelector('.decor-greeting');
    
    // change theme
    const divToggleTheme = document.querySelector('.div-toggle-theme');

// logic of header

document.addEventListener('scroll', () => {
    const currentPos = window.pageYOffset;
    
    if (currentPos >= 400) {
        header.classList.add('moved');
    }
    else {
        header.classList.remove('moved');
    }
})

// logic of theme

if (localStorage.getItem('theme') === 'dark') {
    body.classList.toggle('dark');
    divToggleTheme.classList.toggle('dark');
    listOfSkills.forEach(el => {
        el.classList.toggle('dark');
    })
}

divToggleTheme.addEventListener('click', () => {
    body.classList.toggle('dark');
    divToggleTheme.classList.toggle('dark');
    listOfSkills.forEach(el => {
        el.classList.toggle('dark');
    })
    
    if (body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark')
    } else {
        localStorage.setItem('theme', 'light')
    }
})


// slider

let currentIndexOfSliderProjects = 0;
let currentIndexOfSliderCertificates = 0;

sliderBtnLeftProjects.addEventListener('click', () => {
    currentIndexOfSliderProjects--;
    moveSliderProjects();
})

sliderBtnRightProjects.addEventListener('click', () => {
    currentIndexOfSliderProjects++;
    moveSliderProjects();
})

sliderBtnLeftCertificates.addEventListener('click', () => {
    currentIndexOfSliderCertificates--;
    moveSliderCertificates();
})

sliderBtnRightCertificates.addEventListener('click', () => {
    currentIndexOfSliderCertificates++;
    moveSliderCertificates();
})

function moveSliderProjects() {
    const currentPosSlider = slider[0].offsetWidth;
    if (currentIndexOfSliderProjects == -1) {
        currentIndexOfSliderProjects = 4;
    }
    else if (currentIndexOfSliderProjects == 5) {
        currentIndexOfSliderProjects = 0;
    }
    
    slider[0].style.transform = `translateX(-${currentIndexOfSliderProjects * currentPosSlider}px)`;
}

function moveSliderCertificates() {
    const currentPosSlider = slider[1].offsetWidth;
    if (currentIndexOfSliderCertificates == -1) {
        currentIndexOfSliderCertificates = 1;
    }
    else if (currentIndexOfSliderCertificates == 2) {
        currentIndexOfSliderCertificates = 0;
    }
    
    slider[1].style.transform = `translateX(-${currentIndexOfSliderCertificates * currentPosSlider}px)`;
}

// img greeting

document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;

    const distance = 0.1;

    const x = (window.innerWidth / 2 - e.pageX) * distance;
    const y = (window.innerHeight / 2 - e.pageY) * distance;

    divImgAboutMe.style.transform = `translate(${x}px, ${y}px)`;
});

divImgAboutMe.style.transform = `translateY(0)`;
divImgAboutMe.style.opacity = 1;

// drop-down menu for lang

const langBtn = document.querySelector('.dropdown-btn');
const contentLang = document.querySelector('.dropdown-content');

langBtn.addEventListener('click', () => {
  if (contentLang.style.maxHeight) {
    contentLang.style.maxHeight = null;
    contentLang.style.transform = 'scale(0)';
  } else {
    contentLang.style.maxHeight = contentLang.scrollHeight + 'px';
    contentLang.style.transform = 'scale(1)';
  }
});

// change lang

function changeLanguage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerText = translations[lang][key];
  });

  document.documentElement.lang = lang;
}

const paramLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
changeLanguage(paramLang);
insertFlag(paramLang);

// change lang by btns

document.addEventListener('click', (e) => {
    const clicked = e.target.closest('button');
    if (clicked) {
        changeLanguage(clicked.dataset.lang);
        insertFlag(clicked.dataset.lang);
    } else {
        contentLang.style.maxHeight = null;
        contentLang.style.transform = 'scale(0)';
    }
});

function insertFlag(lang) {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (lang === 'en') {
        dropdownBtn.innerHTML = 'EN<img src="./assets/icons/flags/uk.svg" alt="England flag">';
    } else {
        dropdownBtn.innerHTML = 'RU<img src="./assets/icons/flags/ru.svg" alt="England flag">';
    }
}