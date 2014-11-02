
import gfw.models.entity.EntityLivingModel as EntityLivingModel;

exports = Class(EntityLivingModel, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', arguments);
    this.gameModel = opts.gameModel;
    this.radius = opts.radius;
  };

  this.reset = function(opts) {
    supr(this, 'reset', arguments);
  };
});