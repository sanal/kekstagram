'use strict';

(function () {
  var EFFECT_PREFIX = 'effects__preview--';
  var MAX_EFFECT_VALUE = 100;

  var Effect = {
    CHROME: {
      name: 'chrome',
      setFilter: function (value) {
        return 'grayscale(' + (value / MAX_EFFECT_VALUE) + ')';
      }
    },
    SEPIA: {
      name: 'sepia',
      setFilter: function (value) {
        return 'sepia(' + (value / MAX_EFFECT_VALUE) + ')';
      }
    },
    MARVIN: {
      name: 'marvin',
      setFilter: function (value) {
        return 'invert(' + (value) + '%)';
      }
    },
    PHOBOS: {
      name: 'phobos',
      setFilter: function (value) {
        return 'blur(' + (value * 3 / MAX_EFFECT_VALUE) + 'px)';
      }
    },
    HEAT: {
      name: 'heat',
      setFilter: function (value) {
        return 'brightness(' + (1 + value * 2 / MAX_EFFECT_VALUE) + ')';
      }
    },
    NONE: {
      name: 'none',
      setFilter: function () {
        return '';
      }
    },
  };

  var Scale = {
    DEFAULT: 100,
    STEP: 25,
    MAX: 100,
    MIN: 25
  };

  var ScaleButton = {
    INCR: 'zoom-in',
    DECR: 'zoom-out',
    VALUE: 'zoom-value',
  };

  var imagePreview = document.querySelector('.img-upload__preview img');

  var effectList = document.querySelector('.effects');
  var effectControl = document.querySelector('.effect-level');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectDepth = document.querySelector('.effect-level__depth');
  var effectValue = document.querySelector('.effect-level__value');

  var scaleControl = document.querySelector('.img-upload__scale');
  var scaleValue = document.querySelector('.scale__control--value');

  var currentEffect = Effect.NONE;

  /** Функция установки фильтра
   * @function
   * @param {string} effect
   */
  function setEffect(effect) {
    setEffectLevel(MAX_EFFECT_VALUE);

    imagePreview.className = EFFECT_PREFIX + effect;

    if (Effect[effect] === Effect.NONE) {
      effectControl.classList.add(window.util.Class.HIDDEN);
    } else {
      effectControl.classList.remove(window.util.Class.HIDDEN);
    }
  }

  /** Функция вычисления и установки значения уровня насыщенности фильтра
   * @function
   * @param {number} value
   */
  function setEffectLevel(value) {
    if (value >= 0 && value <= 100) {
      imagePreview.style.filter = Effect[currentEffect].setFilter(value);

      effectValue.value = value;
      effectPin.style.left = value + '%';
      effectDepth.style.width = value + '%';
    }
  }

  /** Обработчик переключения фильтров
   * @callback
   * @param {*} evt
   */
  function onEffectChange(evt) {
    currentEffect = evt.target.value.toUpperCase();

    setEffect(currentEffect);
  }

  /** Обработчик перетаскивания слайдера насыщенности
   * @callback
   * @param {*} evt
   */
  function onPinMousedown(evt) {
    evt.preventDefault();

    var target = evt.target;
    var percent = target.parentNode.offsetWidth / MAX_EFFECT_VALUE;
    var proportion = (target.offsetLeft / percent);
    var start = evt.clientX;

    function onMove(moveEvt) {
      moveEvt.preventDefault();

      var move = moveEvt.clientX;
      var shift = start - move;

      start = move;
      proportion = proportion - (shift / percent);
      effectPin.style.left = effectPin.offsetLeft - shift;

      setEffectLevel(Math.round(proportion));
    }

    function onUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /** Функция масштабирования изображения
   * @function
   * @param {number} value
   */
  function setScale(value) {
    scaleValue.value = value + '%';
    imagePreview.style.transform = 'scale(' + value / Scale.MAX + ')';
  }

  /** Обработчик нажатия на элемент управления масштабированием изображения
   * @callback
   * @param {*} evt
   */
  function onScaleClick(evt) {
    var target = evt.target;
    var scale = parseInt(scaleValue.value, 10);

    switch (target.id) {
      case ScaleButton.INCR:
        scale += Scale.STEP;
        break;
      case ScaleButton.DECR:
        scale -= Scale.STEP;
        break;
      case ScaleButton.VALUE:
        scale = Scale.DEFAULT;
        break;
      default:
    }

    if (scale >= Scale.MIN && scale <= Scale.MAX) {
      setScale(scale);
    }
  }

  /** Функция сброса значений редактирования
   * @function
   */
  function resetEdit() {
    currentEffect = Effect.NONE.name.toUpperCase();

    setScale(Scale.DEFAULT);
    setEffect(currentEffect);
    setEffectLevel(MAX_EFFECT_VALUE);

    imagePreview.className = EFFECT_PREFIX + Effect.NONE.name;
    effectControl.classList.add(window.util.Class.HIDDEN);
  }

  window.uploadEdit = {
    /** Функция запуска модуля редактирования
     * @function
     */
    start: function () {
      effectList.addEventListener('change', onEffectChange);
      effectPin.addEventListener('mousedown', onPinMousedown);
      scaleControl.addEventListener('click', onScaleClick);
    },

    /** Функция остановки модуля редактирования
     * @function
     */
    stop: function () {
      resetEdit();
      effectList.removeEventListener('change', onEffectChange);
      effectPin.removeEventListener('mousedown', onPinMousedown);
      scaleControl.removeEventListener('click', onScaleClick);
    },
  };
})();
