// MainMenu state

var MainMenu = function(game) {};
MainMenu.prototype = {
	create: function(){
		game.stage.backgroundColor = '#facade';
		var titleText = game.add.text(game.width/2, game.height/2,'Soul Ship');
		var instructionText = game.add.text(game.width/2, game.height/2 + 50,'Press SPACEBAR to start');
		var controlsText = game.add.text(game.width/2, game.height/2 + 150, 'Use WASD to move');
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Tutorial');
		}
	}
};