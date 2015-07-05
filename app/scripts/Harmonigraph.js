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
      sketch: null,
      actionMode: 'DRAW_VERTEX',
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
    this.graph.setCurrentMode('drawVertex');
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

  nextMode() {
    this.graph.nextMode();
  }

  addVertex(config) {
    let v = this.graph.addVertex(config);

    // add an oscillator to the vertex
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(240);
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
    return this.graph.render();
  }

  // disableActions() {

  //   // remove event handlers for harmonigraph
  //   // specific events
  //   let actionList = [
  //     'click.harmonigraph.play',
  //     'click.harmonigraph.addVertex'
  //   ];

  //   this.$canvas.off(actionList.join(' '));
  //   this.graph.disableActions();
  // }

  // _setupPlayMode() {
  //   console.log('play mode');

  //   this.graph.setActionMode('PLAY_MODE');
    
  //   // setup click handler so that when vertex is clicked, oscillator is played
  //   this.$canvas.on('click.harmonigraph.play', (e) => {
  //     e.preventDefault();

  //     _.filter(this.graph.vertices, vertex => vertex.hasMouseOver())
  //       .forEach((vertex) => {
  //         console.log(vertex);

  //         if (!vertex._isPlaying){
  //           vertex.color = [0,0,255,100];
  //           vertex._isPlaying = true;
  //           vertex.osc.amp(0.25, 0.05);
  //         } else {
  //           vertex.color = vertex._defaultColor;
  //           vertex._isPlaying = false;
  //           vertex.osc.amp(0, 0.5);
  //         }
  //       });
  //   });
  // }

  // _setupDrawMode() {
  //   console.log('Draw Mode');

  //   // setup draw mode, but disable actions
  //   this.graph.setActionMode('DRAW_VERTEX', false);

  //   // FIXME: this feels ugly. find a better way
  //   // to override the default addVertex
  //   // we want to use the Harmonigraph's addVertex
  //   // on click so that an oscillator is added.
  //   this.$canvas.on('click.harmonigraph.addVertex', (e) => {
  //     e.preventDefault();
  //     this.addVertex({
  //       x: this.sketch.mouseX,
  //       y: this.sketch.mouseY
  //     });
  //   });
  // }

  // setActionMode(mode) {
  //   this.actionMode = mode;

  //   // turn off any existing actions
  //   this.disableActions();

  //   if (mode === 'PLAY_MODE') {
  //     this._setupPlayMode();
  //   } else if (mode === 'DRAW_VERTEX') {
  //     this._setupDrawMode();
  //   } else {
  //     this.graph.setActionMode(mode);
  //   }
  // }

}

module.exports = Harmonigraph;