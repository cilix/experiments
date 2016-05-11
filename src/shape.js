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