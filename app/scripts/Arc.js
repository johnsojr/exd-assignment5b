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
    if (!this.head) {
      s.line(this.tail.x, this.tail.y, s.mouseX, s.mouseY);
    } else {
      s.line(this.tail.x, this.tail.y, this.head.x, this.head.y);
    }
    s.pop();
  

    // if tail is set, but head is null, draw line to
    // current mouse position
  }

}

module.exports = Arc;