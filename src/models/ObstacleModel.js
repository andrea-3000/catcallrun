
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
  };

  this.reset = function(opts) {
    supr(this, 'reset', arguments);
    this.type = opts.type;

    console.log(this.type.collides);

    this.hasHit = false;

    // update the collision rect
    // since the view is centered on bottom center, we will also center on that
    this.rect = new Rect(0, 0, this.type.width, this.type.height);
    this.rect.x = this.x - this.type.width / 2;
  };

  this.hitPlayer = function(model) {
    this.hasHit = true;
    if (this.type === exports.TYPES.powerup) {
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
    if (this.active && !this.hasHit && this.type.collides && intersect.circleAndRect(player, this.rect)) {
      this.hitPlayer(player);
    }

    if (this.y > this.gameModel.modelSpace.bottom) {
      this.active = false;
    }
  };
});

exports.TYPES = {
  /* 
    killPlayer
    stopsBullets
    spawnsOnSidewalk
    spawnsOnRoad
    collides
  */
  pothole: { // stays in one place, bullets go over it
    image: IMAGES_DIR + 'pathole.png',
    width: 102,
    height: 100,
    killPlayer: true,
    collides: true,
  },
  bush: { //stays in one place, bullets hit it
    image: IMAGES_DIR + 'bush.png',
    width: 73,
    height: 63,
    killPlayer: true,
    stopsBullets: true,
    spawnsOnSidewalk: true,
    collides: true
  },
  powerup: {
    image: IMAGES_DIR + 'calculator_mockup.png',
    width: 52,
    height: 76,
    collides: true
  },
  enlightened: {
    image: IMAGES_DIR + 'enlightened_mockup.png',
    width: 102,
    height: 123
  }
};