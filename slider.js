const PLAYBACK_STATE = {
    PAUSE: 'pause',
    PLAY: 'play'
};

class Slider {
    constructor(sliderElement, config) {
        this.playbackState = PLAYBACK_STATE.PLAY;
        this.delay = config.delay;
        this.autoPlay = config.autoPlay;
        this.currentSlide = 0;
        this.slides = [];
        this.sliderNavigation = createElement('ul', '.slider__navigation');
        this.sliderArrows = createElement('ul', '.slider__arrows');

        this.handleSlideNavigationClick = this.handleSlideNavigationClick.bind(this);
        this.selectNextSlide = this.selectNextSlide.bind(this);
        this.selectPrevSlide = this.selectPrevSlide.bind(this);
        this.handleSliderNavigationPause = this.handleSliderNavigationPause.bind(this);
        this.stopOnMouseEnter = this.stopOnMouseEnter.bind(this);
        this.playOnMouseOut = this.playOnMouseOut.bind(this);

        const leftArrow = createElement('li', '.slider__arrow_left');
        const rightArrow = createElement('li', '.slider__arrow_right');
        this.sliderArrows.appendChild(leftArrow);
        this.sliderArrows.appendChild(rightArrow);

        for (let childIndex = 0; childIndex < sliderElement.children.length; childIndex++) {
            this.slides.push(sliderElement.children[childIndex]);
            this.slides[childIndex].setAttribute('data-count', childIndex.toString());
        }

        this.slides[0].setAttribute('class', 'slider__item__current');
        this.slides[0].style.left = `0px`;

        for (let slide = 1; slide < this.slides.length; slide++) {
            this.slides[slide].setAttribute('class', 'slider__item');
            this.slides[slide].style.left = `${960 * slide}px`;
        }

        for (let index = 0; index < this.slides.length; index++) {
            const sliderNavigationItem = createElement('li', '.slider__navigation-item');
            sliderNavigationItem.setAttribute('data-count', index.toString());
            this.sliderNavigation.appendChild(sliderNavigationItem);
        }

        if (this.autoPlay) {
            this.initInterval();
            const sliderNavigationItemPause = createElement('li', '.slider__navigation-item__pause__stop');
            this.sliderNavigation.appendChild(sliderNavigationItemPause);
            sliderElement.appendChild(this.sliderArrows);
            sliderNavigationItemPause.addEventListener('click', this.handleSliderNavigationPause, false);
            rightArrow.addEventListener('click', this.selectNextSlide, false);
            leftArrow.addEventListener('click', this.selectPrevSlide, false);
            sliderElement.addEventListener('mouseover', this.stopOnMouseEnter, false);
            sliderElement.addEventListener('mouseout', this.playOnMouseOut, false);
        }

        this.sliderNavigation.children[this.currentSlide].setAttribute('class', 'slider__navigation-item_current');
        sliderElement.insertBefore(this.sliderNavigation, sliderElement.firstChild);

        this.sliderNavigation.addEventListener('click', this.handleSlideNavigationClick, false);
    }

    handleSlideNavigationClick(event) {
        const
            element = event.target,
            selectedId = element.getAttribute('data-count');

        if (selectedId) {
            clearInterval(this.currentInterval);

            this.changeCurrentSlide(selectedId);

            if (this.autoPlay && this.playbackState === PLAYBACK_STATE.PLAY) {
                this.initInterval();
            }
        }
    }

    selectNextSlide() {
        let nextSlide = parseInt(this.currentSlide) + 1;

        if (nextSlide === this.slides.length) {
            nextSlide = 0;
        }

        this.changeCurrentSlide(nextSlide);
    }

    selectPrevSlide() {
        let nextSlide = parseInt(this.currentSlide) - 1;

        if (this.currentSlide === 0) {
            nextSlide = this.slides.length - 1;
        }

        this.changeCurrentSlide(nextSlide);
    }

    changeCurrentSlide(nextSlide) {
        this.sliderNavigation.children[this.currentSlide].setAttribute('class', 'slider__navigation-item');
        this.sliderNavigation.children[nextSlide].setAttribute('class', 'slider__navigation-item_current');
        this.slides[this.currentSlide].setAttribute('class', 'slider__item');
        this.slides[nextSlide].setAttribute('class', 'slider__item__current');
        this.currentSlide = nextSlide;

        for (let slide = 0; slide < this.slides.length; slide++) {
            this.slides[slide].style.left = `${960 * (slide - this.currentSlide)}px`;
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

    stopOnMouseEnter(event) {
        const element = event.target;

        if (element.className === 'slider__item__current') {
            clearInterval(this.currentInterval);
        }
    }

    playOnMouseOut(event) {
        const element = event.target;

        if (element.className === 'slider__item__current') {
            this.initInterval();
        }
    }

    initInterval() {
        this.currentInterval = setInterval(this.selectNextSlide, this.delay);
    }
}

function createElement(element, name) {
    const
        unit = document.createElement(element),
        attr = 'class';

    unit.setAttribute(attr, name.substr(1));

    return unit;
}