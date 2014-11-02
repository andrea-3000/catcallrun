
import gfw.models.entity.EntityLivingModel as EntityLivingModel;
import math.geom.intersect as intersect;

exports = Class(EntityLivingModel, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', arguments);
    this.gameModel = opts.gameModel;
    this.radius = opts.radius
  };

  this.reset = function(opts) {
    supr(this, 'reset', arguments);
    this.hasHit = false;
  };

  this.hitPlayer = function(model) {
    this.hasHit = true;
    this.gameModel.hitEnemy(this);
  };

  this.step = function(dt) {
    supr(this, 'step', arguments);

    // Check if colliding with the player
    var player = this.gameModel.player;
    if (this.active && !this.hasHit && intersect.circleAndCircle(player, this)) {
      this.hitPlayer(player);
    }

    // Check if the model is off the bottom of the screen
    if (this.y > this.gameModel.modelSpace.bottom) {
      this.active = false;
    }
  };
});