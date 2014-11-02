import src.conf.globals;
import device;
if (USE_WEEBY) { jsio('import weeby'); }

import src.myController as myController;

exports = Class(USE_WEEBY ? weeby.Application : GC.Application, function(supr) {
  this._settings = {
    alwaysRepaint: true,
    logsEnabled: true,
    showFPS: false
  };

  this.initUI = function() {
    window.addEventListener('pageshow', bind(this, "onAppShow"), false);
    window.addEventListener('pagehide', bind(this, "onAppHide"), false);
    window.addEventListener('onfocus', bind(this, 'onAppFocus'), false);
    window.addEventListener('onblur', bind(this, 'onAppBlur'), false);
  };

  this.launchUI = function() {
    this._gameLoaded = false;

    controller = new myController();

    if(USE_WEEBY) {
      // weeby.launchUI();
      // weeby.on('StartGame', bind(this, 'onStartGame'));
    } else {
      GC.hidePreloader();
      this.startGame({
        powerups: {
          star: {},
          time: {},
          shield: {}
        },
        itemshop: {
          star: { level: 1 },
          time: { level: 1 },
          shield: { level: 2 }
        },
        sound: {
          effects: true,
          music: true
        }
      });
    }
  };

  this.getRootView = function() {
    return USE_WEEBY ? weeby.getGameView() : this.view;
  };

  this.startGame = function(data) {
    var c = controller;
    c.setData('sfxEnabled', data.sound.effects);
    c.setData('musicEnabled', data.sound.music);
    if (!this._gameLoaded) {
      this._gameLoaded = true;

      c.setRootView(this.getRootView());
      c.transitionToMenu(); 
      //c.transitionToGame();
    } else {
      var gameView = c.screenViews['GameView'];
      gameView.resetView();
    }
  };

  this.onAppShow = function() {};
  this.onAppHide = function() {};
  this.onAppFocus = function() {};
  this.onAppBlur = function() {};
});
