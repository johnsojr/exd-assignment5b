'use strict';

/**
* A directed edge (aka an arc)
**/

const _ = require('lodash');

class Arc {

  /**
  * Creates a new graph
  **/
  constructor(config) {
    let defaults = {
      tail: null,
      head: null,
      sketch: null
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => { // fat arrow this binding ftw!
      this[key] = value;
    });

    if (!this.sketch) {
      throw(`Edge ${this} has no p5JS sketch is set for rendering`);
    }
  }

  hasMouseOver() {
    throw 'hasMouseOver() is unimplemented';
  }

  setTail(vertex) {
    this.tail  = vertex;
    return this;
  }
  setHead(vertex) {
    this.head = vertex;
    return this;
  }

  render() {
    let s = this.sketch;

    // if no tail, nothing to draw. Move along.
    if (!this.tail) {
      return;
    }

    s.push();
    s.translate(this.tail.x, this.tail.y);

    let arcHead = this.head || {x: s.mouseX, y: s.mouseY };

    // draw it straight down then rotate
    // to make arrowhead drawing cleaner
    let dy = arcHead.y - this.tail.y;
    let dx = arcHead.x - this.tail.x;
    let arcLength = Math.sqrt(dy*dy + dx*dx);
    s.rotate(Math.PI/2 - Math.atan2(dy, -dx));
    s.line(0,0,0,arcLength);

    // create arrowhead
    s.push();
    s.translate(0, arcLength);
    s.line(0,0, -6, -10);
    s.line(0,0, 6, -10);
    s.pop();

    s.pop();
  

    // if tail is set, but head is null, draw line to
    // current mouse position
  }

}

module.exports = Arc;