'use strict';

(function () {
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = document.querySelector('#upload-file');
  var uploadModal = document.querySelector('.img-upload__overlay');
  var cancelButton = document.querySelector('.img-upload__cancel');

  /** Функция открытия окна редактирования
   * @function
   */
  function openUpload() {
    var preview = window.preview.get();

    if (preview) {
      window.uploadEdit.start();
      window.validation.start();
      window.uploadSubmit.start();

      uploadModal.classList.remove(window.util.Class.HIDDEN);
      document.body.classList.add(window.util.Class.MODAL_OPENED);

      document.addEventListener('keydown', onEscPress);
      cancelButton.addEventListener('click', closeUpload);
    } else {
      uploadInput.value = '';
    }
  }

  /** Функция закрытия окна редактирования
   * @function
   */
  function closeUpload() {
    uploadForm.reset();
    window.uploadEdit.stop();
    window.validation.stop();
    window.uploadSubmit.stop();

    uploadInput.value = '';

    uploadModal.classList.add(window.util.Class.HIDDEN);
    document.body.classList.remove(window.util.Class.MODAL_OPENED);

    document.removeEventListener('keydown', onEscPress);
    cancelButton.removeEventListener('click', closeUpload);
  }

  /** Обработчик нажатия на клавишу Esc
   * @callback
   * @param {*} evt
   */
  function onEscPress(evt) {
    if (evt.code === 'Escape') {
      window.util.checkFocus(closeUpload);
    }
  }

  uploadInput.addEventListener('change', openUpload);

  window.upload = {
    open: openUpload,
    close: closeUpload
  };
})();
