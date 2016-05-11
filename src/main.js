var Canvas = require('./canvas.js');
var Shape = require('./shape.js');
var Box = require('./box.js');

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
