/**
* A musical track
**/

'use strict';

const _ = require('lodash');
let p5 = require('p5');
require('p5/lib/addons/p5.sound');

class Track {

  constructor(config) {
    let defaults = {
      beatsPerSecond: 1,
      color: [100,100,255,100],
      sketch: null,
      notes: [440,550,660,770,0,0,0,0],
      sound: null, // p5 sound object
      transpose: 0,
      rotation: 0,
      discSize: 200,
      minFreq: 196, // G3
      maxFreq: 1175 // D6
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => { // fat arrow this binding ftw!
      this[key] = value;
    });


    // setup oscillator for this track
    this.osc = new p5.Oscillator();
    this.osc.setType('triangle');
    this.osc.amp(0);
    this.osc.start();

  }

  getCurrentBeat() {
    return this.rotation / (2 * Math.PI) * 8;
  }

  getCurrentNote() {
    let noteIndex = Math.floor(this.getCurrentBeat()) % this.notes.length;
    return this.notes[noteIndex];
  }

  playNote(note) {
    this.osc.amp(0.5);
    this.osc.freq(note);
  }

  update() {
    let framesPerSecond = this.sketch.frameRate();
    let rotationPerBeat = Math.PI/4; // 45deg 
    this.rotation += 1/framesPerSecond * rotationPerBeat;
    this.playNote(this.getCurrentNote());
  }

  _setCoordinateMode(modeName) {
    let s = this.sketch;
    if (modeName.toUpperCase() === 'CARTESIAN') {
      s.translate(s.width/2, s.height/2);
      s.scale(1,-1); // flip
    }
  }

  _renderGrid(r = 200) {
    let s = this.sketch;

    s.push();
    s.ellipse(0,0,r,r); // outer circle
    s.line(0, -1 * r, 0, r); // vert axis
    s.line(-1 * r, 0, r, 0); // horz axis
    
    // ltr diag
    s.line( r * Math.cos(135/180 * Math.PI),
            r * Math.sin(135/180 * Math.PI),
            r * Math.cos(-45/180 * Math.PI),
            r * Math.sin(-45/180 * Math.PI)
          );
    
    //rtl diag
    s.line( r * Math.cos(45/180 * Math.PI),
            r * Math.sin(45/180 * Math.PI),
            r * Math.cos(-135/180 * Math.PI),
            r * Math.sin(-135/180 * Math.PI)
          );

    // center circle
    s.fill(255);
    s.ellipse(0,0, 20, 20);
    s.pop();
  }

  _renderNeedle() {
    let s = this.sketch;

    s.push();
    s.fill(0);
    s.translate(0, this.discSize);
    s.triangle(0,0,-10,17,10,17);
    s.pop();
  }

  _renderNotes() {
    let s = this.sketch;

    for (let i=0, len = this.notes.length; i < len; i++) {
      let freq = this.notes[i];
      if (freq > 0) {
        s.push();
        s.fill(i * 33);
        s.rotate(-1 * i / len * 2 * Math.PI);

        // linearize the frequency
        let y = s.map(
            Math.log(freq),
            Math.log(this.minFreq),
            Math.log(this.maxFreq),
            20,
            this.discSize
        );
        s.ellipse(0,y,10,10);
        s.pop();
      }
    }
  }

  render() {
    let s = this.sketch;

    s.push(); // begin render
      this._setCoordinateMode('CARTESIAN');
      s.ellipseMode(s.RADIUS);
      s.noFill();

      // begin rotation
      s.push(); 
        s.rotate(this.rotation);
        this._renderGrid(this.discSize);
        this._renderNotes();
      s.pop(); // end rotation

      // needle - non-rotating
      this._renderNeedle();

    s.pop(); // end render context

  }
}

module.exports = Track;