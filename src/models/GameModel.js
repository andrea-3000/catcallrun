import math.geom.Rect as Rect;
import math.geom.intersect as intersect;

import gfw.models.GameModel as GameModel;
import gfw.lib.utils as utils;
import gfw.controller.GameInterval as GameInterval;

import src.models.PlayerModel as PlayerModel;
import src.models.ObstacleModel as ObstacleModel;
import src.models.BulletModel as BulletModel;

exports = Class(GameModel, function(supr) {
  // Constants and references //
  var random = Math.random;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var sin = Math.sin;
  var rollFloat = utils.rollFloat;
  var rollInt = utils.rollInt;
  var shuffle = utils.shuffle;

  var POWERUP_LENGTH = 3;

  this.init = function(opts) {
    supr(this, 'init', [opts]);
    this.view = null;

    this.gameOver = false;
    this.score = 0;
    this.redrawScore = false;
    this.poweredUp = false;

    this.player = new PlayerModel({
      gameModel: this,
      radius: 30
    });
    this.playerSpawnX = 100;
    this.playerSpawnY = 100;
    this.targetPlayerX = this.playerSpawnX;

    this.bulletLevel = 0;
  };

  this.addScore = function(amount) {
    this.score += amount;
    this.redrawScore = true;
  };

  this.reset = function(opts) {
    supr(this, 'reset', [opts]);
    this.view = opts.view;
    this.enemyMVC = opts.enemyMVC;
    this.bulletMVC = opts.bulletMVC;
    this.obstacleMVC = opts.obstacleMVC;

    var viewStyle = this.view.style;
    this.modelSpace = new Rect(
      viewStyle.x, viewStyle.y,
      viewStyle.width, viewStyle.height
      );
    this.modelSpace.right = this.modelSpace.x + this.modelSpace.width;
    this.modelSpace.bottom = this.modelSpace.y + this.modelSpace.height;

    this.bulletLevel = 1;

    // SIMPLE RESETS //
    this.gameOver = false;
    this.score = 0;
    this.redrawScore = true;
    this.poweredUp = false;
    this.powerupTimeRemaining = 0;

    this.playerSpawnX = this.view.style.width / 2;
    this.playerSpawnY = this.view.style.height - 65;
    this.targetPlayerX = this.playerSpawnX;

    this.player.reset({
      x: this.playerSpawnX,
      y: this.playerSpawnY,
    });

    this.enemySpawnTimer = new GameInterval({
      tickInterval: 1.5,
      tickImmediately: true,
      tickFunction: function() { this.spawnEnemy(); }.bind(this)
    });

    this.obstacleSpawnTimer = new GameInterval({
      tickInterval: 2,
      tickImmediately: true,
      tickFunction: function() { this.spawnObstacle(); }.bind(this)
    });

    this.playerShootTimer = new GameInterval({
      tickInterval: 0.2,
      tickFunction: function() { this.playerShoot(); }.bind(this)
    });
  };

  this.playerShoot = function() {
    var bulletType = BulletModel.LEVEL_TYPES[this.bulletLevel];
    this.bulletMVC.obtain({
      x: this.player.x,
      y: this.player.y,
      dy: -600,
      type: bulletType
    });
  };

  this.movePlayerTo = function(x) {
    if (x < this.modelSpace.x) {
      x = this.modelSpace.x;
    }
    else if (x > this.modelSpace.right) {
      x = this.modelSpace.right;
    }
    this.targetPlayerX = x;
  };

  this.spawnEnemy = function() {
    this.enemyMVC.obtain({
      x: rollFloat(this.modelSpace.x + 100, this.modelSpace.right - 100),
      y: this.modelSpace.y - 60
    });
  };

  this.spawnObstacle = function() {
    var obstacleType = ObstacleModel.TYPES.powerup;
    if (random() < 0.9) {
      obstacleType = random() < 0.5 ?
        ObstacleModel.TYPES.pothole :
        ObstacleModel.TYPES.bush;
    }

    var randoX;
    if (obstacleType === ObstacleModel.TYPES.pothole) {
      randoX = rollFloat(this.modelSpace.x + 120, this.modelSpace.right - 120);
    } else if (obstacleType === ObstacleModel.TYPES.bush){
      console.log("math??");
    } else {
      randoX = rollFloat(this.modelSpace.x + 100, this.modelSpace.right - 100);
    }

    this.obstacleMVC.obtain({
      x: randoX,
      y: this.modelSpace.y - 60,
      type: obstacleType
    });
  };

  this.spawnEnlightened = function(enemyX, enemyY) {
    var obstacleType = ObstacleModel.TYPES.enlightened;
    this.obstacleMVC.obtain({
      x: enemyX,
      y: enemyY,
      type:obstacleType
    });
  }

  this.collectPowerup = function(powerupModel) {
    powerupModel.active = false;
    console.log(BulletModel.LEVEL_TYPES.length);
    if (this.bulletLevel < BulletModel.LEVEL_TYPES.length - 1) {
      this.bulletLevel++;
    }
    this.poweredUp = true;
    this.powerupTimeRemaining = POWERUP_LENGTH;
    // Do something with that powerup
    console.warn('Powerup collected, do something with it');
  };

  this.killEnemy = function(enemyModel) {
    enemyModel.active = false;
    this.addScore(1);
    // add caap and gown
  };

  this.hitObstacle = function(ObstacleModel) {
    this._killPlayer();
  };

  this.hitEnemy = function(enemyModel) {
    this._killPlayer();
  };

  this._killPlayer = function() {
    this.player.die();
    this.setGameOver();
  };

  this.step = function(dt) {
    this._elapsed += dt;

    if (!this.player.isDead) {
      // Keep the player from jumping directly to the x
      this.player.x += (this.targetPlayerX - this.player.x) * 0.3;
      this.playerShootTimer.step(dt);
    }

    // step the GameIntervals
    if (!this.gameOver) {
      if (this.poweredUp) {
        console.log("powered up is true");
        this.poweredUp = false;
        this.powerupTimeRemaining -= dt;
      }
      this.enemySpawnTimer.step(dt);
      this.obstacleSpawnTimer.step(dt);
    }
  };

  this.setGameOver = function() {
    this.gameOver = true;
    this.view.onGameOver();
  };
});
