'use strict';

const _ = require('lodash');

class Vertex {

  /**
  * Creates a new graph
  **/
  constructor(config) {
    let defaults = {
      x: 0,
      y: 0,
      radius: 10,
      color: [100,100,100,100],
      activeColor: [255,0,0],
      clickHandlers: [],
      sketch: null,
      _isMoving: false,
      moveOnDrag: true
    };

    config = _.assign({}, defaults, config);

    _.each(config, (value, key) => {
      this[key] = value;
    });

    if (!this.sketch) {
      throw(`Vertex ${this} has no p5JS sketch is set for rendering`);
    }

    this._setupMoveOnDrag();

  }

  _setupMoveOnDrag() {
    if (this.moveOnDrag) {

      // toggle _isMoving when mouse is down 
      this.sketch.canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();

        if (this.hasMouseOver()) {
          this._isMoving = true;
        }
      });

      // stop moving upon release
      this.sketch.canvas.addEventListener('mouseup', (e) => {
        e.preventDefault();
        if (this.hasMouseOver()) {
          this._isMoving = false;
        }
      });
    }
  }

  hasMouseOver() {
    let sketch = this.sketch;
    return sketch.dist(this.x, this.y, sketch.mouseX, sketch.mouseY) <= this.radius;
  }

  /**
  * A Click handler for the vertex
  **/
  onClick(fn) {
    let sketch = this.sketch;
    sketch.canvas.addEventListener('click', () => {
      if (this.hasMouseOver()) {
        return fn();
      }
    }, false);
  }

  moveTo(x,y) {
    this.x = x;
    this.y = y;
  }

  render() {
    let s = this.sketch;

    s.push();
    s.ellipseMode(s.RADIUS);
    s.fill(this.color);

    // is this being dragged?
    if (this._isMoving) {
      this.moveTo(s.mouseX, s.mouseY);
      s.fill(this.activeColor);
    }

    s.ellipse(this.x, this.y, this.radius, this.radius);
    s.pop();
  }

}

module.exports = Vertex;