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
        console.log(this.music_vol, this.sfx_vol);

  },
  preload: function() {
    //all preloading done in Load state
  },
	create: function(){
    game.sound.stopAll();
    
    //Victory screen
    if(this.victory) {
      game.add.image(0, 0, "gameover win");
      game.add.bitmapText(game.width/2, game.height/7, "aldrich64", 'Congratulations!', 96).anchor.set(0.5);
      game.add.bitmapText(game.width/4 + 40, game.height/4, "aldrich64", 'You Won!', 48).anchor.set(0.5);
      this.menu = game.add.button(3* game.width/4 + 30, 7*game.height/8, "return to menu", this.changeState, this).anchor.set(0.5);

    }
    //Loss screen
    else {
      game.add.image(0, 0, "gameover loss");
      game.add.bitmapText(game.width/2, game.height/8 + 40, "aldrich64", 'Game Over', 150).anchor.set(0.5);
      this.retry = game.add.button(game.width/2, 5*game.height/6, "retry", this.changeState, this).anchor.set(0.5);
      this.menu = game.add.button(game.width/2, 7*game.height/8 + 40, "return to menu", this.changeState, this).anchor.set(0.5);
      // game.add.bitmapText(game.width/2, 7*game.height/8, "aldrich64", 'Press R to Retry', 84).anchor.set(0.5);
    }
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.R)){
			game.state.start(this.previous, true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
   if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
        game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }


	},
    //detects which button was pressed and goes to the corresponding state
    changeState: function(button, pointer, isOver) {
      var state;
      switch(button.key) {
        case "retry":
          state = this.previous;
          break;
        case "return to menu":
          state = "MainMenu";
          break;
        default:
          console.log(button);
          break; 
      }
      game.sound.stopAll()﻿;
      game.state.start(state, true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
};