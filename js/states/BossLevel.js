// Boss Level State

// be strict
'use strict';

	var frames;
	var timer;

var BossLevel = function(game){

};
BossLevel.prototype = {
	preload: function(){
		//preload assets

	},
	create: function(){
		var player = new PlayerShip(game);
		game.add.existing(player);

	},
	update: function(){
		// allow player to start games
		// debug to go to game over
		if (game.input.keyboard.justPressed(Phaser.Keyboard.Q)){
			game.state.start('GameOver');
		}
	}
};


