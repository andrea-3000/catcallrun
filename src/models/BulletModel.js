
import gfw.models.entity.EntityModel as EntityModel;
import math.geom.intersect as intersect;
import src.models.ObstacleModel as ObstacleModel;

exports = Class(EntityModel, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', [opts]);
    this.gameModel = opts.gameModel;
    this.radius = opts.radius;

    //this.hasHit = false;
  };

  this.reset = function(opts) {
    supr(this, 'reset', arguments);

    this.hasHit = false;
  };

  this.hitEnemy = function(enemyModel) {
    this.hasHit = true;
    this.active = false;
    enemyModel.hurt(1);
  };

  this.step = function(dt) {
    supr(this, 'step', arguments);

    // TODO: check for collision
    this.gameModel.enemyMVC.modelPool.forEachActive(function(model) {
      if (this.active && !this.hasHit && intersect.circleAndCircle(this, model)) {
        this.hitEnemy(model);
      }
    }.bind(this));

    this.gameModel.obstacleMVC.modelPool.forEachActive(function(model) {
      if(model.type.stopsBullets) {
        if (this.active && !this.hasHit && intersect.circleAndCircle(this, model)) {
          this.active = false;
        }
      }
      
    }.bind(this));

    if (this.y < this.gameModel.modelSpace.y) {
      this.active = false;
    }
  };
});