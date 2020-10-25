'use strict';

(function () {
  var FILE_TYPE = ['image'];

  var uploadInput = document.querySelector('#upload-file');
  var imagePreview = document.querySelector('.img-upload__preview img');
  var effectsPreview = document.querySelectorAll('.effects__preview');

  window.preview = {
    /** Функция вставки редактируемого изображения в разметку
     * @function
     * @return {boolean}
     */
    get: function () {
      var file = uploadInput.files[0];

      if (!file.type.includes(FILE_TYPE)) {
        return false;
      }

      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imagePreview.src = reader.result;
        effectsPreview.forEach(function (element) {
          element.style = 'background-image: url(' + reader.result + ')';
        });
      }, {once: true});

      reader.readAsDataURL(file);

      return true;
    }
  };
})();
