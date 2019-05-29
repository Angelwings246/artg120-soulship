//GameOver state

var GameOver = function(game) {};
GameOver.prototype = {
  init: function(victory, main, alt, music_vol, sfx_vol, previous){
    //keep track of whether the player won or lost
    this.victory = victory;
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
    this.previous = previous; //track the previous state the player was in
  },
  preload: function() {
    //preload assets
    // game.load.path = "assets/img/";
    // game.load.image("background", "bg.png");
  },
	create: function(){
    game.add.image(0, 0, "background");
    //Victory message
    if(this.victory) {
      game.add.text(game.width/2, game.height/3, 'Congrats you did it', {fontSize: "32px", fill:"#FFFFFF"});
    }
    else {
      game.add.image(0, 0, "gameover loss");
      game.add.bitmapText(game.width/2, game.height/8 + 40, "aldrich64", 'Game Over', 100).anchor.set(0.5);
      game.add.bitmapText(game.width/2, 7*game.height/8, "aldrich64", 'Press R to Retry', 84).anchor.set(0.5);
    }
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.R)){
			game.state.start(this.previous, true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
   if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
        game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }


	}
};