//GameOver state

var GameOver = function(game) {};
GameOver.prototype = {
  init: function(victory, main, alt){
    //keep track of whether the player won or lost
    this.victory = victory;
    this.main = main;
    this.alt = alt;
  },
  preload: function() {
    //preload assets
    game.load.path = "assets/img/";
    game.load.image("background", "bg.png");
  },
	create: function(){

    game.sound.stopAll();
    game.add.image(0, 0, "background");
    //Victory message
    if(this.victory) game.add.text(game.width/2, game.height/3, 'Congrats you did it', {fontSize: "32px", fill:"#FFFFFF"});

		var resetText = game.add.text(game.width/2, game.height/2, 'Game Over, Press R to reset', {fontSize: "32px", fill:"#FFFFFF"});
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.R)){
			game.state.start('BossLevel', true, false, this.main, this.alt);

		}
	}
};