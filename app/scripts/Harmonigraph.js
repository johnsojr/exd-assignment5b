/**
* Takes a graph and makes it sound pretty
**/

const _ = require('lodash');
const Graph = require('./Graph');

class Harmonigraph {

  constructor(config) {
    let defaults = {
      graph: null,
      sketch: null
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });

    // construct a new graph, if there isn't one
    if (!this.graph) {
      this.graph = new Graph({sketch: this.sketch});
    }
  }

  cycleActionMode() {
    this.graph.cycleActionMode();
  }

  addVertex(config) {
    this.graph.addVertex(config);
  }

  addArc(config) {
    this.graph.addArc(config);
  }

  render() {
    this.graph.render();
  }

  setActionMode(mode) {
    this.graph.setActionMode(mode);
  }

}

module.exports = Harmonigraph;