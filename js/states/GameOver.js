//GameOver state

var GameOver = function(game) {};
GameOver.prototype = {
  init: function(victory){
    this.victory = victory;
  },
	create: function(){
		game.stage.backgroundColor = '#facade';
    game.sound.stopAll();

    //Victory message
    if(this.victory) game.add.text(game.width/2, game.height/3, 'Congrats you did it');

		var resetText = game.add.text(game.width/2, game.height/2, 'Press R to reset');
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.R)){
			game.state.start('BossLevel');
		}
	}
};