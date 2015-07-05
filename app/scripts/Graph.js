/**
* Creates a simple Graph Instrument
**/

'use strict';

const _ = require('lodash');
const Vertex = require('./Vertex');
const Arc = require('./Arc');


class Graph {

  /**
  * Creates a new graph
  **/
  constructor(config) {
    let defaults = {
      vertices: [],
      arcs: []
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });
  }

  addVertex(config) {
    let v = new Vertex(config);
    this.vertices.push(v);
    return v;
  }

  addArc(tailVertex, headVertex) {
    let arc = new Arc({ tail: tailVertex, head: headVertex });
    this.arcs.push(arc);
    return arc;
  }

  render(sketch) {

    // draw the vertices
    _.forEach(this.vertices, (vertex) => {
      vertex.render(sketch);
    });

    // draw the arcs
    _.forEach(this.arcs, (arc) => {
      arc.render(sketch);
    });
  }

}

module.exports = Graph;