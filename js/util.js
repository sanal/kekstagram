'use strict';

(function () {
  window.util = {
    // Ключевые CSS-классы
    Class: {
      PICTURE: 'picture',
      HIDDEN: 'hidden',
      MODAL_OPENED: 'modal-open'
    },

    /** Функция случайного перемешивания массива
     * @function
     * @param {Array} arr
     * @return {Array}
     */
    shuffle: function (arr) {
      var j;
      var temp;

      for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }

      return arr;
    },

    /** Функция проверки фокуса
     * @function
     * @param {function} callback
     */
    checkFocus: function (callback) {
      var focus = document.activeElement;
      var isFocused = (focus.tagName === 'INPUT' && focus.type === 'text' || focus.tagName === 'TEXTAREA');

      if (!isFocused) {
        callback();
      }
    }
  };
})();
