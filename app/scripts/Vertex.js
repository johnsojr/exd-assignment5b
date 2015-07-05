'use strict';

const _ = require('lodash');

class Vertex {

  /**
  * Creates a new graph
  **/
  constructor(config) {
    let defaults = {
      x: 0,
      y: 0,
      radius: 10,
      color: [100,100,100,100],
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });
  }

  render(sketch) {
    let s = sketch;

    s.push();
    s.ellipseMode(s.RADIUS);
    s.fill(this.color);
    s.ellipse(this.x, this.y, this.radius, this.radius);
    s.pop();
  }

}

module.exports = Vertex;