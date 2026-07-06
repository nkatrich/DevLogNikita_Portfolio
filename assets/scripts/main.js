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


// slider (универсальный, работает с любым количеством .slider внутри .block-of-slider)

function createSliderController(blockEl) {
    const leftBtn = blockEl.querySelector('[class*="slider-btn-left"]');
    const rightBtn = blockEl.querySelector('[class*="slider-btn-right"]');
    let activeSlider = blockEl.querySelector('.slider:not([hidden])');
    let currentIndex = 0;

    function setActiveSlider(sliderEl) {
        activeSlider = sliderEl;
        currentIndex = 0;
        activeSlider.style.transform = 'translateX(0px)';
    }

    function move(direction) {
        const count = activeSlider.children.length;
        if (count === 0) return;

        currentIndex += direction;
        if (currentIndex < 0) currentIndex = count - 1;
        if (currentIndex >= count) currentIndex = 0;

        const width = activeSlider.offsetWidth;
        activeSlider.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    leftBtn.addEventListener('click', () => move(-1));
    rightBtn.addEventListener('click', () => move(1));

    return { setActiveSlider };
}

const projectsBlock = document.querySelector('.my-projects .block-of-slider');
const certificatesBlock = document.querySelector('.my-certificates .block-of-slider');

const projectsSliderCtrl = createSliderController(projectsBlock);
createSliderController(certificatesBlock);

// toggle категорий (Web / GameDev)

const toggleCategoryBtns = document.querySelectorAll('.toggle-category-btn');

toggleCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        toggleCategoryBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        projectsBlock.querySelectorAll('.slider').forEach(sliderEl => {
            if (sliderEl.dataset.category === category) {
                sliderEl.hidden = false;
                projectsSliderCtrl.setActiveSlider(sliderEl);
            } else {
                sliderEl.hidden = true;
            }
        });
    });
});

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

// canvas effects

(function () {
    const canvas = document.createElement('canvas');
    canvas.className = 'ash-ember-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height, dpr;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Ash {
        constructor() {
            this.reset(true);
        }
        reset(initial) {
            this.x = rand(0, width);
            this.y = initial ? rand(0, height) : height + rand(0, 30);
            this.size = rand(1, 3);
            this.speedY = rand(0.15, 0.45);
            this.swaySpeed = rand(0.3, 0.9);
            this.swayAmount = rand(10, 40);
            this.angle = rand(0, Math.PI * 2);
            this.baseX = this.x;
            this.opacity = rand(0.08, 0.35);
            this.life = 0;
            this.maxLife = rand(600, 1400);
        }
        update() {
            this.life++;
            this.angle += 0.01 * this.swaySpeed;
            this.y -= this.speedY;
            this.x = this.baseX + Math.sin(this.angle) * this.swayAmount;

            if (this.y < -10 || this.life > this.maxLife) {
                this.reset(false);
                this.life = 0;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(180, 180, 180, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Ember {
        constructor() {
            this.reset(true);
        }
        reset(initial) {
            this.x = rand(0, width);
            this.y = initial ? rand(height * 0.4, height) : height + rand(0, 30);
            this.size = rand(1.5, 3.5);
            this.speedY = rand(0.4, 1.1);
            this.swaySpeed = rand(0.5, 1.3);
            this.swayAmount = rand(15, 50);
            this.angle = rand(0, Math.PI * 2);
            this.baseX = this.x;
            this.flicker = rand(0, Math.PI * 2);
            this.life = 0;
            this.maxLife = rand(200, 400);
            this.hue = rand(15, 35);
        }
        update() {
            this.life++;
            this.angle += 0.02 * this.swaySpeed;
            this.flicker += 0.15;
            this.y -= this.speedY;
            this.x = this.baseX + Math.sin(this.angle) * this.swayAmount;

            if (this.y < -10 || this.life > this.maxLife) {
                this.reset(false);
                this.life = 0;
            }
        }
        draw() {
            const progress = this.life / this.maxLife;
            const opacity = Math.max(0, (5.6 - progress * 5.6)) * (5.6 + 0.4 * Math.sin(this.flicker));
            const size = this.size * (1 - progress * 0.5);

            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 4);
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, size * 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${opacity})`;
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const ashCount = Math.min(50, Math.floor((width * height) / 22000));
    const emberCount = Math.min(14, Math.floor((width * height) / 90000));

    const ashParticles = Array.from({ length: ashCount }, () => new Ash());
    const emberParticles = Array.from({ length: emberCount }, () => new Ember());

    let visible = true;
    document.addEventListener('visibilitychange', () => {
        visible = document.visibilityState === 'visible';
    });

    function animate() {
        requestAnimationFrame(animate);
        if (!visible) return;

        ctx.clearRect(0, 0, width, height);

        ashParticles.forEach((p) => {
            p.update();
            p.draw();
        });

        emberParticles.forEach((p) => {
            p.update();
            p.draw();
        });
    }

    animate();
})();