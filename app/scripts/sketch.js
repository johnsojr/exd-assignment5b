// sketch.js
/*jshint newcap: false */

'use strict';

const p5 = require('p5');
const $ = require('jquery');
const _ = require('lodash');

const Track = require('./track');

let tracks = [];
let sound, osc;

function mySketch(s) {


  s.setup = function() {

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    // create a new track
    let conf = {
      sketch: s,
      sound: sound
    };

    let t = new Track(conf);
    tracks.push(t);
    console.log(tracks);

  };

  s.draw = function() {
    s.clear();
    _.each(tracks, function(track) {
      track.update();
      track.render();
    });
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