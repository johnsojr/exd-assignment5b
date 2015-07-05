// sketch.js
/*jshint newcap: false */

'use strict';

const p5 = require('p5');
const $ = require('jquery');
const Graph = require('./Harmonigraph');

let graph;

function mySketch(s) {

  s.setup = function() {

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    graph = new Graph({sketch: s});

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

  s.keyTyped = function() {
    let key = s.key.toUpperCase();

    if (key === ' ') {
      graph.nextMode();
    }

    // activate Vertex Drawing Mode
    if (key === 'V') {
      graph.setActionMode('DRAW_VERTEX');
    }

    // Edge Drawing Mode
    if (key === 'E' || key === 'A') {
      graph.setActionMode('DRAW_ARC');
    }

    // Move Mode
    if (key === 'M') {
      graph.setActionMode('MOVE_VERTEX');
    }

    if (key === 'X') {
      graph.setActionMode('DELETE');
    }

    // prevent browser defaults
    return false; 
  };

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};