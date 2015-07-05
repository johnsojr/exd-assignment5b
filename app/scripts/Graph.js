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
    if (!config.sketch) {
      throw(`Vertex ${this} has no p5JS sketch is set for rendering`);
    }

    let defaults = {
      vertices: [],
      arcs: [],
      sketch: null
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });

  }

  addVertex(config) {
    config.sketch = this.sketch;
    let v = new Vertex(config);
    this.vertices.push(v);
    return v;
  }

  addArc(tailVertex, headVertex) {
    let arc = new Arc({ tail: tailVertex, head: headVertex, sketch: this.sketch });
    this.arcs.push(arc);
    return arc;
  }

  hasMouseOverVertex() {
    return this.vertices.some(vertex => vertex.hasMouseOver());
  }

  render() {

    // draw the vertices
    _.forEach(this.vertices, (vertex) => {
      vertex.render();
    });

    // draw the arcs
    _.forEach(this.arcs, (arc) => {
      arc.render();
    });
  }

}

module.exports = Graph;