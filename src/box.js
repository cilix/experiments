var Shape = require('./shape.js');

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