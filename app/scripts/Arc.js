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
  }

  render() {
    //let s = sketch;
  }

}

module.exports = Arc;