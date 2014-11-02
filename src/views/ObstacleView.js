import ui.ImageView as ImageView;

import src.models.ObstacleModel as ObstacleModel;

exports = Class(ImageView, function(supr) {
  this.init = function(opts) {
    supr(this, 'init', arguments);
    this.type = -1;
  };

  this.reset = function() {
    this.style.r = 0;
  }

  this.tick = function(dt) {
    if (this.type === ObstacleModel.TYPES.POWERUP) {
      this.style.r += 0.0025 * dt;
    }
  };
});