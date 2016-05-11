/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Canvas = __webpack_require__(1);
	var Shape = __webpack_require__(3);
	var Box = __webpack_require__(4);

	var cube = new Box({
	  origin: {x: 375, y: 250, z: 200},
	  width: 100,
	  height: 100,
	  depth: 100,
	  color: {r: 75, g: 75, b: 75}
	});

	var shape = new Shape({
	  origin: {
	    x: 200,
	    y: 200,
	    z: 200
	  },
	  points: [
	    {x: -50, y: -50, z: 50},
	    {x: 50, y: -50, z: 50},
	    {x: 50, y: 50, z: 50},
	    {x: -50, y: 50, z: 50}
	  ],
	  fill: 'gray'
	});

	cube.isRotatingRight = true;

	var canvas = new Canvas({
	  id: 'screen',
	  width: 1000,
	  height: 500
	});

	function main() {
	  cube.rotateZ(1);
	  cube.rotateX(1);
	  cube.render(canvas.ctx);
	}

	canvas.render(main);


/***/ },
/* 1 */
/***/ function(module, exports) {

	function Canvas(config) {
	  this.el = document.getElementById(config.id);
	  this.ctx = this.el.getContext('2d');
	  this.ctx.imageSmoothingEnabled = false;
	  this.el.width = this.width = config.width;
	  this.el.height = this.height = config.height;
	  this.set = this.reset = Date.now();
	  this.interval = 0;
	  this.strokeStyle;
	  this.fillStyle;
	}

	Canvas.prototype.clear = function() {
	  this.ctx.clearRect(0, 0, this.width, this.height);
	};

	Canvas.prototype.setFrameRate = function (fps) {
	  this.interval = 1000 / fps;
	};

	Canvas.prototype.render = function (fn) {
	  if (!this.interval) {
	    this.clear();
	    fn();
	  } else if (this.set - this.reset > this.interval) {
	    this.clear();
	    fn();
	    this.reset = Date.now();
	  }
	  this.set = Date.now();
	  window.requestAnimationFrame(this.render.bind(this, fn));
	};

	module.exports = Canvas;

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	function Shape(config) {
	  this.points = config.points || this.error('points');
	  this.origin = config.origin || this.error('origin');
	  this.fill   = config.fill   || undefined;
	  this.stroke = config.stroke || undefined;
	}

	Shape.prototype.error = function(msg) {
	  throw new Error("Must provide '" + msg + "' to Shape constructor.");
	  return undefined;
	};

	Shape.prototype.setColor = function (color) {
	  this.fill = color;
	};

	Shape.prototype.point = function(point) {
	  var o = this.origin;
	  var z = o.z + point.z;
	  var f = z / 100;
	  var y = o.y + (point.y * f);
	  var x = o.x + (point.x * f);

	  return {x: x, y: y};
	};

	Shape.prototype.path = function (ctx) {
	  var pts = this.points;
	  var point = this.point(pts[0]);

	  ctx = this.ctxCache || ctx;

	  ctx.beginPath();
	  ctx.moveTo(point.x, point.y);

	  for (var i = 1, l = pts.length; i < l; i++) {
	    point = this.point(pts[i]);
	    ctx.lineTo(point.x, point.y);
	  }

	  ctx.closePath();

	  if (this.fill) {
	    ctx.fillStyle = this.fill;
	    ctx.fill();
	  }

	  if (this.stroke) {
	    ctx.strokeStyle = this.stroke;
	    ctx.stroke();
	  }
	}

	Shape.prototype.render = function (ctx) {
	  this.path(ctx);
	};

	Shape.prototype.translate = function (axis, val) {
	  this.origin[axis] += val;
	};

	Shape.prototype.translateX = function (val) {
	  this.translate('x', val);
	};

	Shape.prototype.translateY = function (val) {
	  this.translate('y', val);
	};

	Shape.prototype.translateZ = function (val) {
	  this.translate('z', val);
	};

	Shape.prototype.rotate = function (a, b, d) {
	  var r = d * (Math.PI / 180);
	  var cos = Math.cos(r);
	  var sin = Math.sin(r);

	  for (var i = 0, l = this.points.length; i < l; i++) {
	    var a0 = this.points[i][a];
	    var b0 = this.points[i][b];

	    this.points[i][a] = (cos * a0) + (sin * b0);
	    this.points[i][b] = (cos * b0) - (sin * a0);
	  }
	}

	Shape.prototype.rotateZ = function (d) {
	  this.rotate('x', 'y', d);
	};

	Shape.prototype.rotateX = function (d) {
	  this.rotate('z', 'y', d);
	};

	Shape.prototype.rotateY = function (d) {
	  this.rotate('x', 'z', d);
	};

	Shape.prototype.scale = function(factor) {
	  for (var i = 0, l = this.points.length; i < l; i++) {
	    this.points[i].x *= factor;
	    this.points[i].y *= factor;
	    this.points[i].z *= factor;
	  }
	};

	module.exports = Shape;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(3);

	function Box(config) {
	  var o = this.origin = {
	    x: config.origin.x,
	    y: config.origin.y,
	    z: config.origin.z
	  };

	  var d = this.depth = config.depth;
	  var w = this.width = config.width;
	  var h = this.height = config.height;

	  var s = {
	    x: -(w/2),
	    y: -(h/2),
	    z: -(d/2)
	  };

	  this.sides = {
	    front: new Shape({
	      origin: {
	        x: o.x,
	        y: o.y,
	        z: o.z
	      },
	      points: [
	        {x: s.x, y: s.y, z: s.z},
	        {x: s.x + w, y: s.y, z: s.z},
	        {x: s.x + w, y: s.y + h, z: s.z},
	        {x: s.x, y: s.y + h, z: s.z}
	      ],
	      stroke: 'gray'
	    }),
	    back: new Shape({
	      origin: {
	        x: o.x,
	        y: o.y,
	        z: o.z
	      },
	      points: [
	        {x: s.x, y: s.y, z: s.z + d},
	        {x: s.x + w, y: s.y, z: s.z + d},
	        {x: s.x + w, y: s.y + h, z: s.z + d},
	        {x: s.x, y: s.y + h, z: s.z + d}
	      ],
	      stroke: 'gray'
	    }),
	    left: new Shape({
	      origin: {
	        x: o.x,
	        y: o.y,
	        z: o.z
	      },
	      points: [
	        {x: s.x, y: s.y, z: s.z},
	        {x: s.x, y: s.y + h, z: s.z},
	        {x: s.x, y: s.y + h, z: s.z + d},
	        {x: s.x, y: s.y, z: s.z + d}
	      ],
	      stroke: 'gray'
	    }),
	    right: new Shape({
	      origin: {
	        x: o.x,
	        y: o.y,
	        z: o.z
	      },
	      points: [
	        {x: s.x + w, y: s.y, z: s.z},
	        {x: s.x + w, y: s.y + h, z: s.z},
	        {x: s.x + w, y: s.y + h, z: s.z + d},
	        {x: s.x + w, y: s.y, z: s.z + d}
	      ],
	      stroke: 'gray'
	    }),
	    top: new Shape({
	      origin: {
	        x: o.x,
	        y: o.y,
	        z: o.z
	      },
	      points: [
	        {x: s.x, y: s.y + h, z: s.z},
	        {x: s.x + w, y: s.y + h, z: s.z},
	        {x: s.x + w, y: s.y + h, z: s.z + d},
	        {x: s.x, y: s.y + h, z: s.z + d}
	      ],
	      stroke: 'gray'
	    }),
	    bottom: new Shape({
	      origin: {
	        x: o.x,
	        y: o.y,
	        z: o.z
	      },
	      points: [
	        {x: s.x, y: s.y, z: s.z},
	        {x: s.x + w, y: s.y, z: s.z},
	        {x: s.x + w, y: s.y, z: s.z + d},
	        {x: s.x, y: s.y, z: s.z + d}
	      ],
	      stroke: 'gray'
	    })
	  };
	}

	Box.prototype.each = function(fn) {
	  [
	    'left','right','top','bottom','front','back'
	  ].forEach(function (s) {
	    fn(this.sides[s], s);
	  }.bind(this));
	};

	Box.prototype.rotateX = function(d) {
	  this.each(function (side) {
	    side.rotateX(d);
	  });
	};

	Box.prototype.rotateY = function(d) {
	  this.each(function (side) {
	    side.rotateY(d);
	  });
	};

	Box.prototype.rotateZ = function(d) {
	  this.each(function (side) {
	    side.rotateZ(d);
	  });
	};

	Box.prototype.render = function(ctx) {
	  /* render order is important */
	  this.each(function (side) {
	    side.render(ctx);
	  });
	};

	module.exports = Box;

/***/ }
/******/ ]);