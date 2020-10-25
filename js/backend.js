'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000; // 10s

  var URL = {
    LOAD: 'https://javascript.pages.academy/kekstagram/data',
    UPLOAD: 'https://js.dump.academy/kekstagram'
  };

  var codeToMessage = {
    '301': 'Moved Permanently',
    '302': 'Moved Temporarily',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '418': 'I\'m a teapot',
    '500': 'Internal Server Error',
    '502': 'Bad Gateway'
  };

  /** Функция создания нового XHR запроса
   * @function
   * @param {function} onLoad
   * @param {function} onError
   * @return {XMLHttpRequest}
   */
  function createXHR(onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status !== SUCCESS_CODE) {
        onError('Статус ответа: ' + xhr.status + ' ' + codeToMessage[xhr.status]);
      }
      onLoad(xhr.response);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания запроса (' + (xhr.timeout / 1000) + ' сек.)');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  }

  window.backend = {
    /** Функция запроса данных
     * @function
     * @param {function} onLoad
     * @param {function} onError
     */
    load: function (onLoad, onError) {
      var xhr = createXHR(onLoad, onError);

      xhr.open('GET', URL.LOAD);
      xhr.send();
    },

    /** Функция отправки данных
     * @function
     * @param {*} data
     * @param {function} onLoad
     * @param {function} onError
     */
    upload: function (data, onLoad, onError) {
      var xhr = createXHR(onLoad, onError);

      xhr.open('POST', URL.UPLOAD);
      xhr.send(data);
    }
  };
})();
