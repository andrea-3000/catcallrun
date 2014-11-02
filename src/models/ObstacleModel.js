
import math.geom.Rect as Rect;
import gfw.models.entity.EntityModel as EntityModel;
import math.geom.intersect as intersect;

exports = Class(EntityModel, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', [opts]);
    this.gameModel = opts.gameModel;
    this.radius = opts.radius;

    this.type = opts.type;

    this.hasHit = false;
    this.rect = new Rect(0, 0, opts.width, opts.height);
  };

  this.reset = function(opts) {
    supr(this, 'reset', arguments);
    this.type = opts.type;

    this.hasHit = false;

    // update the collision rect
    // since the view is centered on bottom center, we will also center on that
    this.rect.x = this.x - this.rect.width / 2;
  };

  this.hitPlayer = function(model) {
    this.hasHit = true;
    if (this.type === exports.TYPES.POWERUP) {
      this.gameModel.collectPowerup(this);
    } else {
      this.gameModel.hitObstacle(this);
    }
  };

  this.step = function(dt) {
    supr(this, 'step', arguments);

    // we need to update the y value every step, since the obstacle is moving in
    // the y direction on screen
    this.rect.y = this.y - this.rect.height;

    // TODO: check for collision
    var player = this.gameModel.player;
    if (this.active && !this.hasHit && intersect.circleAndRect(player, this.rect)) {
      this.hitPlayer(player);
    }

    if (this.y > this.gameModel.modelSpace.bottom) {
      this.active = false;
    }
  };
});

exports.TYPES = {
  STATIC_FLAT: 1, // stays in one place, bullets go over it
  POWERUP: 10
};