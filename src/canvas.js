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