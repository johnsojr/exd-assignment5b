// sketch.js
/*jshint newcap: false */

'use strict';

const p5 = require('p5');
const $ = require('jquery');
const Graph = require('./Graph');

let graph;

function mySketch(s) {

  graph = new Graph({sketch: s});

  s.setup = function() {

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    graph.addVertex({
      x: s.width/2,
      y: s.height/2
    });

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

  s.mouseClicked = function() {
    if (! graph.hasMouseOverVertex()) {
      console.log('new Vertex created!');
      graph.addVertex({
        x: s.mouseX,
        y: s.mouseY
      });
    }
  };

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};