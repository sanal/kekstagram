'use strict';

(function () {
  var COMMENTS_LOAD_INCR = 5;

  var galleryContainer = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var image = document.querySelector('.big-picture__img img');
  var caption = document.querySelector('.social__caption');
  var likesCount = document.querySelector('.likes-count');

  var commentTemplate = document.querySelector('#comment').content.firstElementChild;
  var commentsContainer = document.querySelector('.social__comments');
  var commentsCount = document.querySelector('.social__comment-count');
  var commentsShowed = document.querySelector('.comments-showed');
  var commentsTotal = document.querySelector('.comments-count');
  var commentsLoader = document.querySelector('.comments-loader');
  var commentInput = document.querySelector('.social__footer-text');

  var cancelButton = document.querySelector('.big-picture__cancel');

  /** Конструктор объекта просмотра изображения
   * @constructor
   * @param {*} data
   */
  function Picture(data) {
    /** Функция отрисовки данных
     * @function
     */
    this.render = function () {
      image.src = data.url;
      caption.textContent = data.description;
      likesCount.textContent = data.likes;

      if (data.comments.length === 0) {
        commentsCount.textContent = 'Комментариев пока нет';
        commentsLoader.classList.add(window.util.Class.HIDDEN);
      } else {
        this.loadComments();
      }
    };

    /** Функция загрузки комментариев
     * @function
     */
    this.loadComments = function () {
      var getComment = this.getComment;

      data.comments.slice(this.state.counter * COMMENTS_LOAD_INCR, (this.state.counter + 1) * COMMENTS_LOAD_INCR)
      .forEach(function (item) {
        commentsContainer.appendChild(getComment(item));
      });

      commentsTotal.textContent = data.comments.length;
      commentsShowed.textContent = commentsContainer.children.length;
    };

    /** Функция создания шаблонного элемента комментария
     * @function
     * @param {*} comment
     * @return {Node}
     */
    this.getComment = function (comment) {
      var template = commentTemplate.cloneNode(true);

      template.querySelector('.social__picture').src = comment.avatar;
      template.querySelector('.social__text').textContent = comment.message;

      return template;
    };

    /** Функция открытия окна просмотра
     * @function
     */
    this.open = function () {
      this.render();

      if (data.comments.length > COMMENTS_LOAD_INCR) {
        commentsLoader.addEventListener('click', this.state.onLoader);
      } else {
        commentsLoader.classList.add(window.util.Class.HIDDEN);
      }

      document.addEventListener('keydown', this.state.onEsc);
      cancelButton.addEventListener('click', this.state.onCancel);

      bigPicture.classList.remove(window.util.Class.HIDDEN);
      document.body.classList.add(window.util.Class.MODAL_OPENED);
    };

    /** Функция закрытия окна просмотра
     * @function
     */
    this.onCancelClick = function () {
      commentInput.value = '';
      commentsContainer.innerHTML = '';
      commentsLoader.classList.remove(window.util.Class.HIDDEN);

      commentsLoader.removeEventListener('click', this.state.onLoader);
      document.removeEventListener('keydown', this.state.onEsc);
      cancelButton.removeEventListener('click', this.state.onCancel);

      bigPicture.classList.add(window.util.Class.HIDDEN);
      document.body.classList.remove(window.util.Class.MODAL_OPENED);
    };

    /** Обработчик нажатия на загрузчик комментариев
     * @callback
     */
    this.onLoaderClick = function () {
      if ((++this.state.counter + 1) * COMMENTS_LOAD_INCR >= data.comments.length) {
        commentsLoader.classList.add(window.util.Class.HIDDEN);
      }

      this.loadComments();
    };

    /** Обработчик нажатия на клавишу Escape
     * @callback
     * @param {*} evt
     */
    this.onEscPress = function (evt) {
      if (evt.code === 'Escape') {
        window.util.checkFocus(this.state.onCancel);
      }
    };

    // Состояние объекта
    this.state = {
      counter: 0,
      onCancel: this.onCancelClick.bind(this),
      onEsc: this.onEscPress.bind(this),
      onLoader: this.onLoaderClick.bind(this)
    };
  }

  /** Обработчик нажатия на превью изображения
   * @callback
   * @param {*} evt
   */
  function onPictureClick(evt) {
    var target = evt.target;

    while (target !== evt.currentTarget) {
      if (target.className === window.util.Class.PICTURE) {
        evt.preventDefault();

        var id = target.id;
        var picture = new Picture(window.gallery.data[id]);

        picture.open();

        return;
      }

      target = target.parentNode;
    }
  }

  galleryContainer.addEventListener('click', onPictureClick);
})();
