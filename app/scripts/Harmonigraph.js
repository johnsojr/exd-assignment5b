/**
* Takes a graph and makes it sound pretty
**/

const _ = require('lodash');
const $ = require('jquery');
const p5 = require('p5');
const Graph = require('./Graph');

require('p5/lib/addons/p5.sound');

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

    // cache $canvas
    this.$canvas = $(this.sketch.canvas);

    // construct a new graph, if there isn't one
    if (!this.graph) {
      this.graph = new Graph({sketch: this.sketch});
    }

    // register play mode
    this.graph.addMode('playSound', this._onPlayMode.bind(this), this._offPlayMode.bind(this));

    // register move mode
    //this.graph.addMode('move', this._onMoveVertexMode.bind(this), this._offMoveVertexMode.bind(this));

    // deregister default vertex draw mode
    this.graph.clearMode('drawVertex');

    // register new vertex drawing handlers
    this.graph.addMode('drawVertex', this._onDrawVertexMode.bind(this), this._offDrawVertexMode.bind(this));

    // reset vertex drawing handlers
    this.graph.setCurrentMode('drawVertex');
  }

  nextMode() {
    this.graph.nextMode();
  }

  addVertex(config) {
    let v = this.graph.addVertex(config);

    // add an oscillator to the vertex
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(v.y);
    osc.amp(0);
    osc.start();
    
    v.osc = osc;
    v._isPlaying = false;
    v._defaultColor = v.color;

    return v;

  }

  addArc(config) {
    return this.graph.addArc(config);
  }

  render() {

    // update pitch based on position
    _.forEach(this.graph.vertices, (vertex) => {
      vertex.osc.freq(vertex.y);
    });

    return this.graph.render();
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
          console.log(vertex);

          if (!vertex._isPlaying){
            vertex.color = [0,0,255,100];
            vertex._isPlaying = true;
            vertex.osc.amp(0.25, 0.05);
          } else {
            vertex.color = vertex._defaultColor;
            vertex._isPlaying = false;
            vertex.osc.amp(0, 0.5);
          }
        });
    });
  }

  _offPlayMode() {
    this.$canvas.off('click.harmonigraph.play');
  }


  /**
  * Handles Vertex Moving
  **/
  // _onMoveVertexMode() {
  //   this.$canvas.on('mousedown.harmonigraph.moveVertex',(e) => {
  //     console.log('Mouse Down');
  //     e.preventDefault();
  //     _.filter(this.graph.vertices, v => v.hasMouseOver())
  //      .forEach((vertex) => {
  //         vertex.freq = vertex.y;
  //         vertex.osc.freq(vertex.y);
  //      });
  //   });
  // }

  // _offMoveVertexMode() {
  //   this.$canvas.off('mousedown.harmonigraph.moveVertex');
  // }

}

module.exports = Harmonigraph;