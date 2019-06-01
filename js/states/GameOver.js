//GameOver state

var GameOver = function(game) {};
GameOver.prototype = {
  init: function(victory, main, alt, previous){
    //keep track of whether the player won or lost
    this.victory = victory;
    this.main = main;
    this.alt = alt;
    this.previous = previous; //track the previous state the player was in
  },
  preload: function() {
    //preload assets
    game.load.path = "assets/img/";
    game.load.image("background", "bg.png");
  },
	create: function(){
    game.add.image(0, 0, "background");
    //Victory message
    if(this.victory) game.add.bitmapText(game.width/2, game.height/3, 'aldrich64','Congrats you did it', 32);

		var resetText = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', 'Game Over, Press R to reset', 32);
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.R)){
			game.state.start(this.previous, true, false, this.main, this.alt);

		}
	}
};