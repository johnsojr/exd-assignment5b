// sketch.js
/*jshint newcap: false */

'use strict';

const p5 = require('p5');
const $ = require('jquery');
const Graph = require('./Graph');

let graph = new Graph();

function mySketch(s) {

  s.setup = function() {

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    let v = graph.addVertex({ x: s.width/2, y: s.height/2, sketch: s });


    graph.render();

  };

  s.draw = function() {
    s.clear();
    graph.render();

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