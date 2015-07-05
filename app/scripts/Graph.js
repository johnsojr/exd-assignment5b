/**
* Creates a simple Graph Instrument
**/

'use strict';

const _ = require('lodash');
const $ = require('jquery');
const Vertex = require('./Vertex');
const Arc = require('./Arc');

// const DRAW_VERTEX_MODE = 'DRAW_VERTEX';
// const DRAW_ARC_MODE = 'DRAW_ARC';
// const MOVE_VERTEX_MODE = 'MOVE_VERTEX';
// const DELETE_MODE = 'DELETE';

// const ACTION_MODES = [
//   DRAW_VERTEX_MODE,
//   DRAW_ARC_MODE,
//   MOVE_VERTEX_MODE,
//   DELETE_MODE,
// ];

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
      sketch: null,
      modes: [
        {
          id: 'drawVertex',
          on: [this._onDrawVertexMode],
          off: [this._offDrawVertexMode],
        },
        {
          id: 'drawArc',
          on: [this._onDrawArcMode],
          off: [this._offDrawArcMode],
        },
        {
          id: 'delete',
          on: [this._onDeleteVertexMode],
          off: [this._offDeleteVertexMode],
        }, {
          id: 'move',
          on: [this._onMoveVertexMode],
          off: [this._offMoveVertexMode],
        },
      ],
      currentMode: 'drawVertex',
      displayActionMode: true
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });

    // cache canvas jquery object for click handlers
    this.$canvas = $(this.sketch.canvas);

    // initialize current mode
    this.setCurrentMode(this.currentMode);

  }

  addVertex(config) {
    config.sketch = this.sketch;
    let v = new Vertex(config);
    this.vertices.push(v);
    return v;
  }

  removeVertex(vertexToRemove) {
    _.remove(this.vertices, v => v === vertexToRemove);

    _.remove(this.arcs, (arc) => {
      return arc.tail === vertexToRemove || arc.head === vertexToRemove;
    });
  }

  addArc(config) {
    config.sketch = this.sketch;
    let arc = new Arc(config);
    this.arcs.push(arc);
    return arc;
  }

  hasMouseOverVertex() {
    return this.vertices.some(vertex => vertex.hasMouseOver());
  }

  getMode(modeName) {
    return _.find(this.modes, {id: modeName});
  }

  addMode(modeName, onFn, offFn) {

    let mode = this.getMode(modeName);

    // if mode exists, add functions
    if (mode) {
      this.mode.on.push(onFn);
      this.mode.off.push(offFn);
    }

    // otherwise create a new entry in mode list
    else {
      this.mode.push({
        id: modeName,
        on: [onFn],
        off: [offFn],
      });
    }
  }

  getCurrentMode() {
    return this.getMode(this.currentMode);
  }

  _onMoveVertexMode() {
    this.$canvas.on('mousedown.graph.moveVertex',(e) => {
      e.preventDefault();
      _.filter(this.vertices, v => v.hasMouseOver())
       .forEach(v => v.isMoving = true);
    });

    this.$canvas.on('mouseup.graph.moveVertex', (e) => {
      e.preventDefault();
      this.vertices.forEach(v => v.isMoving = false);
    });
  }

  _offMoveVertexMode() {
    this.$canvas.off('mousedown.graph.moveVertex mouseup.graph.moveVertex');
  }

  _onDrawVertexMode() {
    this.$canvas.on('click.graph.addVertex',(e) => {
      e.preventDefault();
      this.addVertex({
        x: this.sketch.mouseX,
        y: this.sketch.mouseY
      });
    });
  }
  _offDrawVertexMode() {
    this.$canvas.off('click.graph.addVertex');
  }

  _onDeleteVertexMode() {
    this.$canvas.on('click.graph.delete',(e) => {
      e.preventDefault();

      let vertexToRemove = _.find(this.vertices, v => v.hasMouseOver());
      this.removeVertex(vertexToRemove);
    });
  }

  _offDeleteVertexMode() {
    this.$canvas.off('click.graph.delete');
  }

  _onDrawArcMode() {
    // are we currently drawing an arc?
    let drawingArc = null;
    
    this.$canvas.on('click.graph.drawArc', (e) => {
      e.preventDefault();
      let vertexClicked = _.find(this.vertices, v => v.hasMouseOver());

      // we we didn't click on a vertex, we're done
      if (!vertexClicked) {
        return;
      }

      // if we're already drawing an arc, finish it 
      if (drawingArc) {
        drawingArc.setHead(vertexClicked);
        drawingArc = null;
      }

      // if we haven't started a new arc,
      // this this vertex create a new arc
      else {
        drawingArc = this.addArc({tail: vertexClicked});
      }

    });
  }

  _offDrawArcMode() {
    this.$canvas.off('click.graph.drawArc');
    // remove any incomplete arcs
    _.remove(this.arcs, arc => arc.head === null );
  }

  setCurrentMode(modeID) {
    this.currentMode = modeID;

    // deregister actions for all modes
    // TODO: make more performant. Don't need to do
    // this for all modes, just current and previous
    let allOffFns = _.flatten(_.pluck(this.modes, 'off'), true);
    allOffFns.forEach((fn) => {
      return fn.bind(this)();
    });

    // register new mode
    let currentModeOnFns = this.getCurrentMode().on;
    currentModeOnFns.forEach((fn) => {
      return fn.bind(this)();
    });
  }

  cycleActionMode() {

    let idx = _.findIndex(this.modes, {id: this.currentMode });
    let nextIdx = (idx + 1) % this.modes.length;

    this.setCurrentMode(this.modes[nextIdx].id);
  }


  render() {

    let s = this.sketch;

    // show drawing mode
    if (this.displayActionMode) {
      s.push();
      s.fill(0);
      s.textSize(32);
      s.text(this.getCurrentMode().id, 10, 90);
      s.pop(); 
    }

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