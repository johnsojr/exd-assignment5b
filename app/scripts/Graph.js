/**
* Creates a simple Graph Instrument
**/

'use strict';

const _ = require('lodash');

class Graph {

  /**
  * Creates a new graph
  **/
  constructor(config) {
    let defaults = {
      vertices: [],
      arcs: [],
      sketch: null
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => { // fat arrow this binding ftw!
      this[key] = value;
    });
  }

  addVertex(x,y) {
    let v = { x, y, radius: 10};
    this.vertices.push(v);
    return v;
  }

  addArc(tail, head) {
    let arc = { tail, head };
    this.arcs.push(arc);
    return arc;
  }

}

module.exports = Graph;