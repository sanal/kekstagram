'use strict';

(function () {
  var AMOUNT_OF_NEW = 10;

  var FilterClass = {
    FILTERS_INACTIVE: 'img-filters--inactive',
    ACTIVE_FILTER: 'img-filters__button--active'
  };

  var filter = document.querySelector('.img-filters');
  var galleryContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content.firstElementChild;
  var loadErrorTemplate = document.querySelector('#data-error').content.firstElementChild;

  /** Обработчик успешного запроса данных, создаёт массив данных для отрисовки галереи изображений, инициирует первоначальную отрисовку галереи
   * @callback
   * @param {*} data
   */
  function onLoadSuccess(data) {
    data.forEach(function (element, index) {
      element.id = index;
    });

    window.gallery.data = data;

    renderGallery(data);
    filter.classList.remove(FilterClass.FILTERS_INACTIVE);
    filter.addEventListener('click', onFiltersClick);
  }

  /** Обработчик ошибки запроса данных, показывает сообщение об ошибке
   * @callback
   * @param {string} message
   */
  function onLoadError(message) {
    var element = loadErrorTemplate.cloneNode(true);

    element.textContent = message;
    document.body.appendChild(element);
  }

  /** Функция отрисовки галереи изображений
   * @function
   * @param {*} data
   */
  function renderGallery(data) {
    document.querySelectorAll('.' + window.util.Class.PICTURE).forEach(function (element) {
      element.remove();
    });

    var fragment = document.createDocumentFragment();

    data.forEach(function (item) {
      var element = pictureTemplate.cloneNode(true);
      element.id = item['id'];
      element.querySelector('.picture__img').src = item['url'];
      element.querySelector('.picture__likes').textContent = item['likes'];
      element.querySelector('.picture__comments').textContent = item['comments'].length;
      fragment.appendChild(element);
    });

    galleryContainer.appendChild(fragment);
  }

  /** Функция генерации массива новых (случайных) изображений
   * @function
   * @return {Array}
   */
  function sortNew() {
    var copy = window.gallery.data.slice();

    return window.util.shuffle(copy).slice(0, AMOUNT_OF_NEW);
  }

  /** Функция генерации массива данных по убыванию количества комментариев
   * @function
   * @return {Array}
   */
  function sortDiscussed() {
    return window.gallery.data.slice().sort(function (a, b) {
      return +(a.comments.length < b.comments.length) - 0.5;
    });
  }

  /** Обработчик нажатия на кнопку фильтрации галереи
   * @callback
   * @param {*} evt
   */
  function onFiltersClick(evt) {
    var target = evt.target;
    var prev = document.querySelector('.' + FilterClass.ACTIVE_FILTER);

    if (target !== prev && target.tagName === 'BUTTON') {
      target.classList.add(FilterClass.ACTIVE_FILTER);
      prev.classList.remove(FilterClass.ACTIVE_FILTER);

      var filterToSort = {
        'filter-popular': window.gallery.data,
        'filter-new': sortNew(),
        'filter-discussed': sortDiscussed(),
      };

      renderGallery(filterToSort[target.id]);
    }
  }

  window.backend.load(onLoadSuccess, onLoadError);

  window.gallery = {
    data: [],
  };
})();
