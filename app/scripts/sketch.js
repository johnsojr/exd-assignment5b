// sketch.js
/*jshint newcap: false */

'use strict';

const p5 = require('p5');
const $ = require('jquery');
const Graph = require('Graph');


function mySketch(s) {


  s.setup = function() {

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

  };

  s.draw = function() {

  };

  s.windowResized = function() {
    let $canvasWrapper = $('.canvas-wrapper');

    let w = $canvasWrapper.innerWidth();
    let h = $canvasWrapper.height();

    // put in canvasWrapper
    s.resizeCanvas(w,h-3);
  };

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};