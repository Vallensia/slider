const PLAYBACK_STATE = {
    PAUSE: 'pause',
    PLAY: 'play'
};

class Slider {
    constructor(sliderElement, config) {
        this.playbackState = PLAYBACK_STATE.PLAY;
        this.currentSlide = 0;
        this.nextSlide = 1;
        this.currentInterval = config;
        this.slides = [];
        this.sliderNavigation = this.createElement('ul', '.slider__navigation');
        this.sliderArrows = this.createElement('ul', '.slider__arrows');

        this.handleSlideNavigationClick = this.handleSlideNavigationClick.bind(this);
        this.selectNextSlide = this.selectNextSlide.bind(this);
        this.selectPrevSlide = this.selectPrevSlide.bind(this);
        this.handleSliderNavigationPause = this.handleSliderNavigationPause.bind(this);

        const leftArrow = this.createElement('li', '.slider__arrow_left');
        const rightArrow = this.createElement('li', '.slider__arrow_right');
        this.sliderArrows.appendChild(leftArrow);
        this.sliderArrows.appendChild(rightArrow);

        for (let childIndex = 0; childIndex < sliderElement.children.length; childIndex++) {
            this.slides.push(sliderElement.children[childIndex]);
            this.slides[childIndex].setAttribute('data-count', childIndex.toString());
        }

        this.slides[0].setAttribute('class', 'slider__item current');
        this.slides[0].style.left = `0px`;

        for (let slide = 1; slide < this.slides.length; slide++) {
            this.slides[slide].setAttribute('class', 'slider__item');
            this.slides[slide].style.left = `${960 * slide}px`;
        }

        for (let index = 0; index < this.slides.length; index++) {
            let sliderNavigationItem = this.createElement('li', '.slider__navigation-item');
            sliderNavigationItem.setAttribute('data-count', index.toString());
            this.sliderNavigation.appendChild(sliderNavigationItem);
        }

        let sliderNavigationItemPause = this.createElement('li', '.slider__navigation-item__pause__stop');
        this.sliderNavigation.appendChild(sliderNavigationItemPause);

        this.sliderNavigation.children[this.currentSlide].setAttribute('class', 'slider__navigation-item_current');
        sliderElement.insertBefore(this.sliderNavigation, sliderElement.firstChild);
        sliderElement.appendChild(this.sliderArrows);

        this.initInterval();

        this.sliderNavigation.addEventListener('click', this.handleSlideNavigationClick, false);
        sliderNavigationItemPause.addEventListener('click', this.handleSliderNavigationPause, false);
        rightArrow.addEventListener('click', this.selectNextSlide, false);
        leftArrow.addEventListener('click', this.selectPrevSlide, false);
    }

    handleSlideNavigationClick(event) {
        const
            element = event.target,
            selectedId = element.getAttribute('data-count');

        if (selectedId) {
            clearInterval(this.currentInterval);

            this.sliderNavigation.children[this.currentSlide].setAttribute('class', 'slider__navigation-item');
            element.setAttribute('class', 'slider__navigation-item_current');
            this.slides[this.currentSlide].setAttribute('class', 'slider__item');
            this.slides[selectedId].setAttribute('class', 'slider__item current');
            this.currentSlide = selectedId;
            this.nextSlide = parseInt(this.currentSlide) + 1;
            for (let slide = 0; slide < this.slides.length; slide++) {
                this.slides[slide].style.left = `${960 * (slide - this.currentSlide)}px`;
            }

            if (this.playbackState === PLAYBACK_STATE.PLAY) {
                this.initInterval();
            }
        }
    }

    selectNextSlide() {
        let nextImage = parseInt(this.currentSlide) + 1;

        if (nextImage === this.slides.length) {
            nextImage = 0;
        }

        this.sliderNavigation.children[this.currentSlide].setAttribute('class', 'slider__navigation-item');
        this.sliderNavigation.children[nextImage].setAttribute('class', 'slider__navigation-item_current');
        this.slides[this.currentSlide].setAttribute('class', 'slider__item');
        this.slides[nextImage].setAttribute('class', 'slider__item current');
        this.currentSlide = nextImage;
        for (let slide = 0; slide < this.slides.length; slide++) {
            this.slides[slide].style.left = `${960 * (slide - this.currentSlide)}px`;
        }
    }

    selectPrevSlide() {
        let nextImage = parseInt(this.currentSlide) - 1;

        if (this.currentSlide === 0) {
            nextImage = this.slides.length - 1;
        }

        this.sliderNavigation.children[this.currentSlide].setAttribute('class', 'slider__navigation-item');
        this.sliderNavigation.children[nextImage].setAttribute('class', 'slider__navigation-item_current');
        this.slides[this.currentSlide].setAttribute('class', 'slider__item');
        this.slides[nextImage].setAttribute('class', 'slider__item current');
        this.currentSlide = nextImage;
        for (let slide = 0; slide < this.slides.length; slide++) {
            this.slides[slide].style.left = `${960 * (slide - this.currentSlide)}px`;
        }
    }

    transitionNextSlide() {

        let nextImage = parseInt(this.currentSlide) + 1;

        if (nextImage === this.slides.length) {
            nextImage = 0;
        }

    }

    handleSliderNavigationPause(event) {
        const element = event.target;

        if (this.playbackState === PLAYBACK_STATE.PLAY) {
            element.setAttribute('class', 'slider__navigation-item__pause__play');
            this.playbackState = PLAYBACK_STATE.PAUSE;
            clearInterval(this.currentInterval);
        } else {
            element.setAttribute('class', 'slider__navigation-item__pause__stop');
            this.playbackState = PLAYBACK_STATE.PLAY;
            this.initInterval();
        }
    }

    initInterval() {
        this.currentInterval = setInterval(this.selectNextSlide, 3000);
    }

    createElement(element, name) {
        const
            unit = document.createElement(element),
            attr = 'class';

        unit.setAttribute(attr, name.substr(1));

        return unit;
    }

}