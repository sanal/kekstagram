'use strict';

(function () {
  var uploadForm = document.querySelector('.img-upload__form');

  var container = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.firstElementChild;
  var errorTemplate = document.querySelector('#error').content.firstElementChild;

  /** Конструктор попапа
   * @constructor
   * @param {*} element
   * @param {string} message
   * @param {*} messageContainer
   */
  function Popup(element, message, messageContainer) {
    if (message) {
      messageContainer.textContent = message;
      element.style.zIndex = 2;
    }

    /** Функция открытия попапа
     * @function
     */
    this.open = function () {
      window.upload.close();

      element.addEventListener('click', this.state.onClick);
      document.addEventListener('keydown', this.state.onEsc);
    };

    /** Функция закрытия попапа
     * @function
     */
    this.close = function () {
      element.remove();
      document.removeEventListener('keydown', this.state.onEsc);
    };

    /** Обработчик клика по попапу
     * @callback
     * @param {*} evt
     */
    this.onClick = function (evt) {
      var target = evt.target;

      if (target.tagName === 'BUTTON' || target === evt.currentTarget) {
        this.state.close();
      }
    };

    /** Обработчик нажатия на клавишу Escape
     * @callback
     * @param {*} evt
     */
    this.onEsc = function (evt) {
      if (evt.code === 'Escape') {
        this.state.close();
      }
    };

    // Состояние объекта
    this.state = {
      onClick: this.onClick.bind(this),
      onEsc: this.onEsc.bind(this),
      close: this.close.bind(this)
    };
  }

  /** Обработчик успешной отправки
   * @callback
   */
  function onSuccess() {
    window.upload.close();

    var template = successTemplate.cloneNode(true);
    var element = container.appendChild(template);
    var popup = new Popup(element);
    popup.open();
  }

  /** Обработчик ошибки отправки формы
   * @callback
   * @param {string} message
   */
  function onError(message) {
    var template = errorTemplate.cloneNode(true);
    var element = container.appendChild(template);
    var messageContainer = element.querySelector('.error__title');

    var popup = new Popup(element, message, messageContainer);
    popup.open();
  }

  /** Обработчик отправки формы
   * @callback
   * @param {*} evt
   */
  function onUploadSubmit(evt) {
    window.backend.upload(new FormData(uploadForm), onSuccess, onError);
    evt.preventDefault();
  }

  window.uploadSubmit = {
    /** Функция запуска модуля
     * @function
     */
    start: function () {
      uploadForm.addEventListener('submit', onUploadSubmit);
    },

    /** Фнукция остановки модуля
     * @function
     */
    stop: function () {
      uploadForm.removeEventListener('submit', onUploadSubmit);
    }
  };
})();
