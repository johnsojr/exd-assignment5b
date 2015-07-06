/**
* Takes a graph and makes it sound pretty
**/

'use strict';

const _ = require('lodash');
const $ = require('jquery');
const p5 = require('p5');
const Graph = require('./Graph');

require('p5/lib/addons/p5.sound');

class Harmonigraph {

  constructor(config) {
    let defaults = {
      graph: null,
      sketch: null,
      beat: 0,
      bpm: 60,
      activeVertices: [],
      inactiveVertices: [],
      defaultMode: 'playSound',
      activeColor: [0,0,255,100],
      continuousUpdates: true,
      _updateID: null,
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });

    // cache $canvas
    this.$canvas = $(this.sketch.canvas);

    // construct a new graph, if there isn't one
    if (!this.graph) {
      this.graph = new Graph({sketch: this.sketch});
    }

    // register play mode
    this.graph.addMode('playSound', this._onPlayMode.bind(this), this._offPlayMode.bind(this));

    // deregister default vertex draw mode
    this.graph.clearMode('drawVertex');

    // register new vertex drawing handlers
    this.graph.addMode('drawVertex', this._onDrawVertexMode.bind(this), this._offDrawVertexMode.bind(this));

    // reset vertex drawing handlers
    this.graph.setCurrentMode(this.defaultMode);
    this.update();
  }

  nextMode() {
    this.graph.nextMode();
  }

  addVertex(config) {
    let v = this.graph.addVertex(config);

    // add an oscillator to the vertex
    let osc = new p5.Oscillator();
    osc.setType('triangle');
    osc.freq(v.y);
    osc.amp(0);
    osc.start();
    
    v.osc = osc;
    v._defaultColor = v.color;

    this.inactiveVertices.push(v);

    return v;

  }

  addArc(config) {
    return this.graph.addArc(config);
  }


  getArcsLeaving(vertex) {
    return _.filter(this.graph.arcs, (arc) => {
      // head must exist
     return arc.tail === vertex && arc.head;
    });
  }

  getNextVerticesAfter(vertex) {
    let arcs = this.getArcsLeaving(vertex);
    return _.pluck(arcs, 'head' );
  }


  isActive(vertex) {
    return _.includes(this.activeVertices, vertex);
  }

  update() {
    // sets up next Vertices
    console.log('updating');
    let nextActives = [];

    // first let's find all the vertices that will be
    // active next round
    _.forEach(this.activeVertices, (vertex) => {
      nextActives = _.union(nextActives, this.getNextVerticesAfter(vertex));
    });

    this.activeVertices = nextActives;

    // find inactives
    this.inactiveVertices = _.difference(this.graph.vertices, nextActives);

    if (this.continuousUpdates) {
      this._updateID = window.setTimeout(this.update.bind(this), this.bpm/60 * 1000);
    }
  

  }

  render() {
    _.forEach(this.activeVertices, (vertex) => {
      vertex.osc.freq(vertex.y);
      vertex.osc.amp(0.25);
      vertex.color = this.activeColor;
    });
    _.forEach(this.inactiveVertices, (vertex) =>{
      vertex.osc.freq(vertex.y);
      vertex.osc.amp(0);
      vertex.color = vertex._defaultColor;
    });

    // render it
    this.graph.render();

  }

  /**
  * Register an oscillator with the vertex
  **/
  _onDrawVertexMode() {
    this.$canvas.on('click.harmonigraph.drawVertex', (e) => {
      e.preventDefault();
      this.addVertex({
        x: this.sketch.mouseX,
        y: this.sketch.mouseY
      });
    });
  }

  _offDrawVertexMode() {
    this.$canvas.off('click.harmonigraph.drawVertex');
  }

  _onPlayMode() {
    this.$canvas.on('click.harmonigraph.play', (e) => {
      e.preventDefault();

      // play a sound for any vertex clicked
      _.filter(this.graph.vertices, vertex => vertex.hasMouseOver())
        .forEach((vertex) => {

          // if it's in active list, remove it
          if (this.isActive(vertex)){
            _.remove(this.activeVertices, vertex);
            this.inactiveVertices.push(vertex);
          } 

          // if not, then make it active
          else {
            _.remove(this.inactiveVertices, vertex);
            this.activeVertices.push(vertex);
          }
        });
    });
  }

  _offPlayMode() {
    this.$canvas.off('click.harmonigraph.play');
  }

}

module.exports = Harmonigraph;