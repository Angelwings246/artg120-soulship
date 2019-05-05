//GameOver state

var GameOver = function(game) {};
GameOver.prototype = {
	create: function(){
		game.stage.backgroundColor = '#facade';
		var resetText = game.add.text(game.width/2, game.height/2, 'Press R to reset');
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.R)){
			game.state.start('BossLevel');
		}
	}
};