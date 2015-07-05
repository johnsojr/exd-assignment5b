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
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => { // fat arrow this binding ftw!
      this[key] = value;
    });
  }

  render(sketch) {
    //let s = sketch;
  }

}

module.exports = Arc;