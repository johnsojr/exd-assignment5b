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
      sketch: null,
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => { // fat arrow this binding ftw!
      this[key] = value;
    });
  }

  setSketch(sketch) {
    this.sketch = sketch;
  }

  render() {}

}

module.exports = Vertex;