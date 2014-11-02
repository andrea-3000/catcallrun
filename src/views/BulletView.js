import ui.ImageView as ImageView;

import src.models.BulletModel as BulletModel;

exports = Class(ImageView, function(supr) {
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
  }
});