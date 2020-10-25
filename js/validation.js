'use strict';

(function () {
  var Hashtag = {
    MAX_AMOUNT: 5,
    MAX_LENGTH: 20,
    MIN_LENGTH: 1
  };

  var hashtagsInput = document.querySelector('#hashtags');

  /** Обработчик ввода хэштегов, осуществляет валидацию
   * @function
   */
  function onHashtagInput() {
    var hashtags = hashtagsInput.value.toLowerCase().split(/\s+/);
    var error = 0;
    var repeat = 0;

    if (hashtags.length === 0 || hashtags[0] === '') {
      hashtagsInput.setCustomValidity('');
    } else if (hashtags.length > Hashtag.MAX_AMOUNT) {
      hashtagsInput.setCustomValidity('Максимальное количество хэш-тегов - ' + Hashtag.MAX_AMOUNT);
    } else {
      hashtags.forEach(function (item, index) {
        if (item === '#') {
          hashtagsInput.setCustomValidity('Хэш-тег не может состоять только из одной решётки');
          error++;
        } else if (item[0] !== '#') {
          hashtagsInput.setCustomValidity('Хэш-тег должен начинаться с символа # (решётка)');
          error++;
        } else if (item.includes('#', Hashtag.MIN_LENGTH) && item.length > Hashtag.MAX_LENGTH) {
          hashtagsInput.setCustomValidity('Хэш-теги разделяются пробелами');
          error++;
        } else if (!item.includes('#', Hashtag.MIN_LENGTH) && item.length > Hashtag.MAX_LENGTH) {
          hashtagsInput.setCustomValidity('Максимальная длина одного хэш-тега - ' + Hashtag.MAX_LENGTH + ' символов (включая решётку)');
          error++;
        } else if (hashtags.includes(item, index + 1)) {
          repeat++;
        } else if (repeat) {
          hashtagsInput.setCustomValidity('Один и тот же хэш-тег не может быть использован больше одного раза');
          error++;
        } else if (!error) {
          hashtagsInput.setCustomValidity('');
        }
      });
    }
  }

  window.validation = {
    /** Функция запуска валидатора хэштегов
     * @function
     */
    start: function () {
      hashtagsInput.addEventListener('input', onHashtagInput);
    },

    /** Функция остановки валидатора хэштегов
     * @function
     */
    stop: function () {
      hashtagsInput.removeEventListener('input', onHashtagInput);
    }
  };
})();
