/**
* Creates a simple Graph Instrument
**/

'use strict';

const _ = require('lodash');
const $ = require('jquery');
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

  /**
  * adds a vertex to the graph
  **/
  addVertex(config) {
    config.sketch = this.sketch;
    let v = new Vertex(config);
    this.vertices.push(v);
    return v;
  }

  /**
  * removes a vertex
  **/
  removeVertex(vertexToRemove) {
    _.remove(this.vertices, v => v === vertexToRemove);

    _.remove(this.arcs, (arc) => {
      return arc.tail === vertexToRemove || arc.head === vertexToRemove;
    });
  }

  /**
  * adds an arc (aka a directed edge) between 
  * two vertices
  * 
  * Takes a config objects containing head and
  * vertices
  * 
  * @example { head: vertex1, tail: vertex 2}
  **/
  addArc(config) {
    config.sketch = this.sketch;
    let arc = new Arc(config);
    this.arcs.push(arc);
    return arc;
  }

  /**
  * detects wheter a mouse is over at least one
  * vertex on the graph.
  *
  * @return boolean
  **/
  hasMouseOverVertex() {
    return this.vertices.some(vertex => vertex.hasMouseOver());
  }

  /**
  * gets the current graph mode
  * e.g. vertex drawing, edge drawing, etc.
  **/
  getMode(modeName) {
    return _.find(this.modes, {id: modeName});
  }

  /**
  * registers new mode and functions that will
  * trigger when mode is activated or deactivated
  *
  * if modeName already exists, onFn and offFn will
  * be added to existing mode functions.
  **/
  addMode(modeName, onFn, offFn) {

    let mode = this.getMode(modeName);

    // if mode exists, add functions
    if (mode) {
      mode.on.push(onFn);
      mode.off.push(offFn);
    }

    // otherwise create a new entry in mode list
    else {
      this.modes.push({
        id: modeName,
        on: [onFn],
        off: [offFn],
      });
    }
  }

  /**
  * returns the current mode object
  * (NOT the current mode id string)
  **/
  getCurrentMode() {
    return this.getMode(this.currentMode);
  }

  /**
  * turns off all handlers for modeID. Then,
  * clears the on/off handlers array.
  * use this when you plan to override the default
  * handlers with your own handler.
  **/
  clearMode(modeID) {

    // deregister event handlers for modeID
    let mode = this.getMode(modeID);
    mode.off.forEach((fn) => {
      return fn.bind(this)();
    });

    // clear eventHandler arrays
    mode.on = [];
    mode.off =[];
  }


  /**
  * sets the currentMode to the modeID
  * Triggers on/off functions.
  **/
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

  /**
  * cycles to the next mode
  **/
  nextMode() {
    let idx = _.findIndex(this.modes, {id: this.currentMode });
    let nextIdx = (idx + 1) % this.modes.length;

    this.setCurrentMode(this.modes[nextIdx].id);
  }

  /**
  * renders graph on a p5 sketch
  **/
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

  /***********************
  * default mode handlers
  ************************/

  /**
  * Handles Vertex Moving
  **/
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

  /**
  * Handles Vertex Drawing
  **/
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

  /**
  * Handles Vertex Deletion
  **/
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

  /**
  * Handles Arc Drawing
  **/
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

}

module.exports = Graph;