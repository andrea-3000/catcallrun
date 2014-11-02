import ui.ImageView as ImageView;

import gfw.lib.utils as utils;

import src.models.ObstacleModel as ObstacleModel;

exports = Class(ImageView, function(supr) {
  var rollFloat = utils.rollFloat;

  this.init = function(opts) {
    supr(this, 'init', arguments);
    this.type = -1;
  };

  this.reset = function(opts) {
    this.type = opts.type;
    this.style.r = 0;

    // TODO: This is sort of shit
    var w = this.type.width;
    var h = this.type.height;
    this.updateOpts({
      image: this.type.image,
      width: w,
      height: h,
      offsetX: -w / 2,
      offsetY: -h / 2,
      anchorX: w / 2,
      anchorY: h / 2
    });

    if (this.type == ObstacleModel.TYPES.pothole) {
      var n = 0.5;
      this.style.r = rollFloat(-n, n);
    }
  }

  this.tick = function(dt) {
    if (this.type === ObstacleModel.TYPES.POWERUP) {
      this.style.r += 0.0025 * dt;
    }
  };
});