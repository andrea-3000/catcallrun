if (USE_WEEBY) { jsio('import weeby'); }
import ui.ImageView as ImageView;
import ui.ScoreView as ScoreView;
import ui.SpriteView as SpriteView;
import ui.ParticleEngine as ParticleEngine;

import gfw.conf.ImageStats as ImageStats;
import gfw.views.screens.GameView as GameView;
import gfw.views.ParallaxView as ParallaxView;
import gfw.lib.utils as utils;
import gfw.lib.AppTick as AppTick;

import gfw.controller.MVController as MVController;
import gfw.models.entity.EntityLivingModel as EntityLivingModel;

import src.models.EnemyModel as EnemyModel;
import src.models.BulletModel as BulletModel;
import src.views.BulletView as BulletView;
import src.models.ObstacleModel as ObstacleModel;
import src.views.ObstacleView as ObstacleView;

exports = Class(GameView, function(supr) {

  var random = Math.random;
  var rollFloat = utils.rollFloat;
  var rollInt = utils.rollInt;
  var splice = utils.splice;
  var cos = Math.cos;
  var sin = Math.sin;
  var atan2 = Math.atan2;
  var abs = Math.abs;
  var PI = Math.PI;

  var gImgs = IMAGES_DIR;
  var img = new ImageStats({
    images: {
      bg: gImgs + 'street.png',
      awning: gImgs + 'awning.png',
      player: gImgs + 'girl_run_0000.png',
      whiteBusiness: gImgs + 'business_mockup.png',

    }
  });

  var DEFAULT_PARALLAX_SPEED = -25;

  var gameModel;

  this.init = function(opts) {
    supr(this, 'init', arguments);
    // AppTick will help normalise tick times, to hide lag spikes
    new AppTick();

    // Get a reference to the game model
    gameModel = controller.gameModel;
    controller.imageInfo = img;

    // TODO: this should probably be moved to the gameModel
    this.currentParallaxSpeed = DEFAULT_PARALLAX_SPEED;

    // Set up the views
    this.designView();
  };

  this.designView = function() {
    var s = this.style;

    // Set background color
    s.backgroundColor = 'gray';

    var parallaxOpts = {
      superview: this,
      x: 0,
      y: 0,
      width: s.width,
      height: s.height
    };
    this.backgroundView = new ParallaxView(parallaxOpts);
    this.backgroundLayer = this.backgroundView.addLayer({
      distance: 50,
      populate: function (layer, y) {
        var v = layer.obtainView(ImageView, {
          superview: layer,
          image: img.bg.path,
          autoSize: true
        });
        return img.bg.h;
      },
      vertical: -1
    });

    // Our cat images have some whitespace, therefore we must adjust it to make
    // the origin ACTUALLY at the characters feet.  You do not need this code
    // unless your graphics have whitespace
    var playerGraphicOffsetX = -12;
    var playerGraphicOffsetY = 65;

    this.enemyMVC = new MVController({
      modelPoolOpts: {
        ctor: EnemyModel,
        initOpts: {
          gameModel: gameModel,
          maxHealth: 2,
          radius: 30
        }
      },
      viewPoolOpts: {
        ctor: ImageView,
        initOpts: {
          superview: this,
          image: img.whiteBusiness.path,
          width: img.whiteBusiness.w,
          height: img.whiteBusiness.h,
          offsetX: -img.whiteBusiness.hw,
          offsetY: -img.whiteBusiness.hh,
          anchorX: img.whiteBusiness.hw,
          anchorY: img.whiteBusiness.hh
        }
      },
      initCount: 10,
      linkedFunc: function(model, view) {
        model.view = view;
      },
      updateViewFunc: function(dt, model, view) {
        var style = view.style;
        style.x = model.x;
        style.y = model.y;
      }
    });

    this.obstacleMVC = new MVController({
      modelPoolOpts: {
        ctor: ObstacleModel,
        initOpts: {
          gameModel: gameModel,
          radius: 20,
        }
      },
      viewPoolOpts: {
        ctor: ObstacleView,
        initOpts: {
          superview: this,
        }
      },
      initCount: 10,
      linkedFunc: function(model, view) {
        model.view = view;
        view.reset({
          type: model.type
        });
      },
      updateViewFunc: function(dt, model, view) {
        var style = view.style;
        style.x = model.x;
        style.y = model.y;
      }
    });

    this.bulletMVC = new MVController({
      modelPoolOpts: {
        ctor: BulletModel,
        initOpts: {
          gameModel: gameModel,
          radius: 10
        }
      },
      viewPoolOpts: {
        ctor: BulletView,
        initOpts: {
          superview: this,
        }
      },
      initCount: 40,
      linkedFunc: function(model, view) {
        model.view = view;
        view.reset({
          type: model.type
        });
      },
      updateViewFunc: function(dt, model, view) {
        var style = view.style;
        style.x = model.x;
        style.y = model.y;
      }
    });

    this.playerView = new SpriteView({
      superview: this,
      url: gImgs + 'girl',
      width: img.player.w,
      height: img.player.h,
      offsetX: -img.player.hw + playerGraphicOffsetX,
      offsetY: -img.player.h + playerGraphicOffsetY,
      anchorX: img.player.hw + playerGraphicOffsetX,
      anchorY: img.player.h + playerGraphicOffsetY,
      frameRate: 9
    });

    this.pEngineAir = new ParticleEngine({
      parent: this,
      x: 0,
      y: 0,
      width: s.width,
      height: s.height,
      initCount: 50
    });

    this.foregroundView = new ParallaxView(parallaxOpts);
    this.foregroundView.addLayer({
      distance: 47,
      populate: function (layer, y) {
        var flipX = random() < 0.5;
        var v = layer.obtainView(ImageView, {
          superview: layer,
          image: img.awning.path,
          x: flipX ? 0 : s.width - img.awning.w,
          flipX: flipX,
          autoSize: true
        });
        return rollFloat(s.height, s.height * 2);
      },
      vertical: -1
    });

    this.setupUI(s);
    this.setupOverlays(s);
    this.setupState(s);
  };

  this.setupUI = function(s) {
    this.scoreTextView = new ScoreView({
      parent: this,
      x: s.width / 2,
      y: 16,
      width: s.width / 2,
      height: 75,
      characterData: {
        "0": { "image": "resources/images/text/score_0.png" },
        "1": { "image": "resources/images/text/score_1.png" },
        "2": { "image": "resources/images/text/score_2.png" },
        "3": { "image": "resources/images/text/score_3.png" },
        "4": { "image": "resources/images/text/score_4.png" },
        "5": { "image": "resources/images/text/score_5.png" },
        "6": { "image": "resources/images/text/score_6.png" },
        "7": { "image": "resources/images/text/score_7.png" },
        "8": { "image": "resources/images/text/score_8.png" },
        "9": { "image": "resources/images/text/score_9.png" },
        ",": { "image": "resources/images/text/score_comma.png" },
        ":": { "image": "resources/images/text/score_colon.png" }
      }
    });
  };

  this.setupOverlays = function(s) {
  };

  this.setupState = function(s) {
    // This will be the index of the touch event used to drag the player
    this.movementInputIndex = -1;
  };

  this.restartGame = function() {
    if(USE_WEEBY) {
      weeby.cancelGame();
    } else {
      this.resetView();
    }
  };

  this.resetView = function() {
    this.pEngineAir.killAllParticles();
    this.enemyMVC.releaseAll();
    this.bulletMVC.releaseAll();
    this.obstacleMVC.releaseAll();

    this.currentParallaxSpeed = DEFAULT_PARALLAX_SPEED;

    gameModel.reset({
      view: this,
      enemyMVC: this.enemyMVC,
      bulletMVC: this.bulletMVC,
      obstacleMVC: this.obstacleMVC
    });

    this.scoreTextView.setText('0');

    this.playerView.startAnimation('run', {
      loop: true
    });
    // TODO: this is to fix a bug where startAnimation does not unpause
    this.playerView.resume();
  };

  this.onBulletDestroyed = function(type, x, y) {
    if(type === BulletModel.TYPES.pencil) {
      this.particleExplo('particle', x, y);
    }
  };

  this.particleExplo = function(urlName, x, y) {
      var size = 10;
      var h = 13;
      var halfSize = 5;
      var vMin = 20;
      var vMax = 65;
      var count = 5;
      var data = this.pEngineAir.obtainParticleArray(count);
      for (var i = 0; i < count; ++i) {
        var pObj = data[i];
        pObj.image = gImgs + urlName + '.png';
        pObj.x = x;
        pObj.y = y;
        pObj.width = halfSize;
        pObj.height = h;
        pObj.offsetX = -halfSize;
        pObj.offsetY = -halfSize;
        pObj.anchorX = halfSize;
        pObj.anchorY = halfSize;
        pObj.scale = 2;

        var dirMult = random() < 0.5 ? -1 : 1;

        pObj.dx = rollFloat(vMin, vMax) * dirMult;
        pObj.ddx = vMax * dirMult;
        pObj.dy = rollFloat(vMin, vMax);
        pObj.ddy = vMax;
        pObj.r = rollFloat(0.075, 0.2) * dirMult;

        pObj.ttl = 600;
        pObj.opacity = 0.75;
        pObj.dopacity = -0.5;
        //pObj.compositeOperation = 'lighter';
      }
      this.pEngineAir.emitParticles(data);
    };

  this.onInputStart = function(evt, point) {

    if (gameModel.gameOver) {
      this.restartGame();
      return;
    }
    if (this.movementInputIndex === -1) {
      this.movementInputIndex = evt.index;
      this._movePlayerToInput(point.x);
    }
  };

  this.onInputMove = function(evt, point) {
    if (evt.index === this.movementInputIndex) {
      this._movePlayerToInput(point.x);
    }
  };

  // This function just adjusts the input some, to make it more sensitive
  this._movePlayerToInput = function(x) {
    var hw = this.style.width / 2;
    var centerOffset = (x - hw) / hw;
    var distToCenter = Math.abs(x - hw);
    gameModel.movePlayerTo(x + (distToCenter * centerOffset) * 0.5);
  };

  // The same as "onInputUp"
  this.onInputSelect = function(evt, point) {
    this.movementInputIndex = -1;
  };

  this.onGameOver = function() {
    this.playerView.pause();
    //game over screen
  };

  this.tick = function(dt) {
    if (this.style.visible && !this.isPaused) {
      var dtSec = dt / 1000;
      if (dtSec > 1) dtSec = 1;
      // Step the models
      this.enemyMVC.stepActive(dtSec);
      this.bulletMVC.stepActive(dtSec);
      this.obstacleMVC.stepActive(dtSec);
      gameModel.step(dtSec);

      if (gameModel.gameOver) {
        this.currentParallaxSpeed *= 0.9;
      }
      var parallaxVerticalDist = this.currentParallaxSpeed * dt;
      this.backgroundView.scrollBy(0, parallaxVerticalDist);
      this.foregroundView.scrollBy(0, parallaxVerticalDist);

      // We want to scroll the obstacles by the same amount as the background.
      // TODO: this is a hack to get this framework out quicker.  There should
      // be a pinObject() function on the layer, which updates a list of
      // 'pinned' objects
      var backgroundScrollAmount = -parallaxVerticalDist / this.backgroundLayer._distance;
      this.enemyMVC.modelPool.forEachActive(function(model) {
        model.y += backgroundScrollAmount;
      }.bind(this));
      this.obstacleMVC.modelPool.forEachActive(function(model) {
        model.y += backgroundScrollAmount;
      }.bind(this));

      // Update the views
      var playerStyle = this.playerView.style;
      playerStyle.x = gameModel.player.x;
      playerStyle.y = gameModel.player.y;

      // Update particles //
      this.pEngineAir.runTick(dt);

      if (gameModel.redrawScore) {
        gameModel.redrawScore = false;
        var scoreString = "" + gameModel.score;
        this.scoreTextView.setText(scoreString);
      }
    }
  };
});
