// sketch.js
/*jshint newcap: false */

'use strict';

const p5 = require('p5');
const $ = require('jquery');
const _ = require('lodash');
const Graph = require('./Harmonigraph');
const NOTE_FREQ = require('./noteFreq');

let graph;

function mySketch(s) {

  function drawBackground() {
    for (let hue = 0; hue <= 255; hue++){
      s.push();
      s.colorMode(s.HSB);
      s.noStroke();
      s.fill([hue,100,100]);
      s.translate(0, hue/256 * s.height);
      s.rect(0,0,s.width, 1/256 * s.height);
      s.pop();
    }
  }

  s.setup = function() {

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    drawBackground();

    graph = new Graph({sketch: s});
    // make global
    window.graph = graph;

    let randomFrequencies = [];
    for (let i=0; i < 8; i++) {
      let randomIdx = _.random(0,NOTE_FREQ.length);
      randomFrequencies.push(NOTE_FREQ[randomIdx]);
    }

    // create initial vertices from
    // random frequencies
    let initialNotes = [];
    randomFrequencies.forEach((freq) => {
      let v = graph.addVertex({
        x: _.random(10,s.width - 10),
        y: s.map(freq,0,880,100,s.height - 100)
      });
      initialNotes.push(v);
    });

    // create initial arcs
    initialNotes.forEach((note, index) => {
      let headIndex = (index + 1) % initialNotes.length;
      graph.addArc({
        tail: note,
        head: initialNotes[headIndex]
      });
    });

    graph.render();

    s.frameRate(30);

  };

  s.draw = function() {
    s.clear();
    drawBackground();
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