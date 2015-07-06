/* jshint devel:true */
'use strict';

let sketch = require('./sketch');
let $ = require('jquery');

sketch.init();

$('.js-add-vertex').on('click', function(e) {
  e.preventDefault();

  // turn on mode
  window.graph.setCurrentMode('drawVertex');

  // toggle active classes
  $('.toolbar .is-active').removeClass('is-active');
  $(this).addClass('is-active');

});

$('.js-add-arc').on('click', function(e) {
  e.preventDefault();

  // turn on mode
  window.graph.setCurrentMode('drawArc');

  // toggle active classes
  $('.toolbar .is-active').removeClass('is-active');
  $(this).addClass('is-active');
});

$('.js-delete').on('click', function(e) {
  e.preventDefault();

  // turn on mode
  window.graph.setCurrentMode('delete');

  // toggle active classes
  $('.toolbar .is-active').removeClass('is-active');
  $(this).addClass('is-active');
});

$('.js-move').on('click', function(e) {
  e.preventDefault();

  // turn on mode
  window.graph.setCurrentMode('move');

  // toggle active classes
  $('.toolbar .is-active').removeClass('is-active');
  $(this).addClass('is-active');
});

$('.js-play').on('click', function(e) {
  e.preventDefault();

  // turn on mode
  window.graph.setCurrentMode('playSound');

  // toggle active classes
  $('.toolbar .is-active').removeClass('is-active');
  $(this).addClass('is-active');
});

$('.js-stop').on('click', function(e) {
  e.preventDefault();

  window.graph.clearActive();

  // turn on mode
  window.graph.setCurrentMode('playSound');

  // toggle active classes
  $('.toolbar .is-active').removeClass('is-active');
  $('.js-play').addClass('is-active');
});