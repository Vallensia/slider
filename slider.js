function slider(slider, config) {
    function createElement(element, name) {
        const
            unit = document.createElement(element),
            attr = name[0] === '.' ? 'class' : 'id';

        unit.setAttribute(attr, name.substr(1));

        return unit;
    }

    /**
     *  Изменяем описание к изображению
     *  @param slide <element>
     *  @param image <element>
     */
    function changeDescription(slide, image) {
        const alt = image.getAttribute('alt');
        let figCaption = slide.getElementsByClassName('slider__caption');

        if (figCaption.length) {
            figCaption[0].textContent = alt;
        } else {
            figCaption = createElement('figcaption', '.slider__caption');
            figCaption.textContent = alt;
            slide.appendChild(figCaption);
        }

    }

    function initSlider(sliderElement) {
        const
            images = [],
            sliderNavigation = createElement('ul', '.slider__navigation');

        let currentImage = 0,
            nextImage = 1,
            currentInterval;

        for (let childIndex = 0; childIndex < sliderElement.children.length; childIndex++) {
            if (sliderElement.children[childIndex].tagName.toLowerCase() === 'img') {
                images.push(sliderElement.children[childIndex]);
                images[childIndex].setAttribute('data-count', childIndex.toString());
            }
        }

        // Скрываем все фотографии, кроме первой
        for (let img = 1; img < images.length; img++) {
            images[img].style.display = 'none';
        }

        // Добавляем навигацию
        for (let index = 0; index < images.length; index++) {
            let sliderNavigationItem = createElement('li', '.slider__navigation-item');
            sliderNavigationItem.setAttribute('data-count', index.toString());
            sliderNavigation.appendChild(sliderNavigationItem);
        }

        changeDescription(sliderElement, images[currentImage]);
        sliderNavigation.children[currentImage].setAttribute('class', 'slider__navigation-item_current');
        sliderElement.insertBefore(sliderNavigation, sliderElement.firstChild);

        initInterval();
        // Обработка кликов по элементам навигации в слайдере
        sliderNavigation.addEventListener('click', handleSlideNavigationClick, false);

        function handleSlideNavigationClick(event) {
            const
                element = event.target,
                selectedId = element.getAttribute('data-count');

            if (selectedId) {
                clearInterval(currentInterval);

                sliderNavigation.children[currentImage].setAttribute('class', 'slider__navigation-item');
                element.setAttribute('class', 'slider__navigation-item_current');
                images[currentImage].style.display = 'none';
                images[selectedId].style.display = 'block';
                changeDescription(sliderElement, images[selectedId]);
                currentImage = selectedId;
                nextImage = parseInt(currentImage) + 1;

                initInterval();
            }
        }

        function initInterval() {
            if (config.delay !== null && config.delay !== undefined) {
                currentInterval = setInterval(selectNextSlide, config.delay);
            }
        }


        function selectNextSlide() {
            nextImage = parseInt(currentImage) + 1;

            if (nextImage === images.length) {
                nextImage = 0;
            }

            sliderNavigation.children[currentImage].setAttribute('class', 'slider__navigation-item');
            sliderNavigation.children[nextImage].setAttribute('class', 'slider__navigation-item_current');
            images[currentImage].style.display = 'none';
            images[nextImage].style.display = 'block';
            changeDescription(sliderElement, images[nextImage]);
            currentImage = nextImage;
        }
    }

    // Инициализируем все слайдеры
    for (let sliders = 0; sliders < slider.length; sliders++) {
        initSlider(slider[sliders]);
    }
}