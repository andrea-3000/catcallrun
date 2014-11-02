import gfw.models.AppModel as AppModel;
import gfw.Controller as Controller;

import src.views.GameView as GameView;
import src.views.PregameView as PregameView;
import src.models.GameModel as GameModel;

exports = Class(Controller, function(supr) {
	this.init = function(opts) {
		opts = opts || {};
		opts.gameModel = GameModel;
		supr(this, 'init', [opts]);
	};

	this.transitionToMenu = function() {
		// Transition to the main menu here if you have one
		//this.transitionToScreen("PregameView", PregameView);
		this.transitionToGame();
	};

	this.transitionToGame = function() {
		this.transitionToScreen("GameView", GameView);
	};
});

// export singleton
// exports = new TemplateController();
