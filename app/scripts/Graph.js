/**
* Creates a simple Graph Instrument
**/

'use strict';

const _ = require('lodash');
const $ = require('jquery');
const Vertex = require('./Vertex');
const Arc = require('./Arc');

const DRAW_VERTEX_MODE = 'DRAW_VERTEX';
const DRAW_ARC_MODE = 'DRAW_ARC';
const MOVE_VERTEX_MODE = 'MOVE_VERTEX';

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
      actionMode: DRAW_VERTEX_MODE,
      displayActionMode: true
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });

    // initialize action mode
    this.setActionMode(this.actionMode);

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

  getActionMode() {
    return this.actionMode;
  }

  setActionMode(mode) {
    console.log('setting action mode');

    this.actionMode = mode;
    let $canvas = $(this.sketch.canvas);
    console.log(this.sketch);
    console.log($canvas);

    // remove event handlers from other actions
    let actionList = [
      'click.graph.addVertex',
      'mousedown.graph.moveVertex',
      'mouseup.graph.moveVertex'
    ];
    $canvas.off(actionList.join(' '));

    // Moving Mode
    if ( mode === MOVE_VERTEX_MODE) {
      $canvas.on('mousedown.graph.moveVertex',(e) => {
        e.preventDefault();

        console.log('mousedown');
        _.filter(this.vertices, v => v.hasMouseOver())
         .forEach(v => v.isMoving = true);
      });

      $canvas.on('mouseup.graph.moveVertex', (e) => {
        e.preventDefault();
        console.log('mouseup');
        this.vertices.forEach(v => v.isMoving = false);
      });
    }

    // Vertex Drawing
    if (mode === DRAW_VERTEX_MODE) {
      $canvas.on('click.graph.addVertex',(e) => {
        console.log('click!');
        e.preventDefault();
        this.addVertex({
          x: this.sketch.mouseX,
          y: this.sketch.mouseY
        });
      });
    }

    // Arc Drawing
    if (mode === DRAW_ARC_MODE) {}
  }


  render() {

    let s = this.sketch;


    // show drawing mode
    if (this.displayActionMode) {
      s.push();
      s.fill(0);
      s.textSize(32);
      s.text(this.actionMode, 10, 90);
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