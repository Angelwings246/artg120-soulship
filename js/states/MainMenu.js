// MainMenu state

var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function() {
      this.main = {
          'up': Phaser.KeyCode.UP,
          'down': Phaser.KeyCode.DOWN,
          'left': Phaser.KeyCode.LEFT,
          'right': Phaser.KeyCode.RIGHT,
          'fire': Phaser.KeyCode.SPACEBAR
       };
      this.alt = {
          'up': Phaser.KeyCode.W, 
          'down': Phaser.KeyCode.S,
          'left': Phaser.KeyCode.A, 
          'right': Phaser.KeyCode.D,
          'fire': Phaser.KeyCode.SPACEBAR
       };
	},
	preload: function() {
   //all preloading done in Load.js
	},
	create: function(){
		// game.stage.backgroundColor = '#facade';
		game.add.image(0, 0, "background");
		var titleText = game.add.bitmapText(game.width/4, game.height/4, "aldrich64", 'Soul Ship', 96);
		// var instructionText = game.add.bitmapText(game.width/4, game.height/2 + 50,"aldrich64", 'Press SPACEBAR to start', 32);
    game.add.button(game.width/3, game.height/2, "start adventure", function() {
          game.sound.stopAll()﻿;
          game.state.start('Tutorial', true, false, this.main, this.alt);});
		game.add.button(game.width/3, 2*game.height/3, "options", function() {
          game.sound.stopAll()﻿;
          game.state.start('Settings', true, false, this.main, this.alt);});
    game.add.button(game.width/3, 5*game.height/6, "credits", function() {
          game.sound.stopAll()﻿;
          game.state.start('Settings', true, false, this.main, this.alt);});



    // var controlsText = game.add.text(game.width/2, game.height/2 + 150, 'Use WASD to move');
		this.MainMenu = game.add.audio("MainMenu");
		this.MainMenu.play('', 0, 1, true);

    game.add.text(10, 10, "Debug: ESC for settings, 1 to skip to Tut1, 2 to skip to Tut2, 3 to skip to Lvl1, 4 to skip to Boss. Credits don't work.", {fontSize: "12px", fill:"#FFFFFF"});
	},
	update: function(){

    //-----DEBUG: REMOVE IN FINAL BUILD-----//
    if (game.input.keyboard.justPressed(Phaser.KeyCode.ONE)){
      game.sound.stopAll()﻿;
      game.state.start('TutorialPt1', true, false, this.main, this.alt);
    }
    if (game.input.keyboard.justPressed(Phaser.KeyCode.TWO)){
      game.sound.stopAll()﻿;
      game.state.start('TutorialPt2', true, false, this.main, this.alt);
    }
    // if (game.input.keyboard.justPressed(Phaser.KeyCode.THREE)){
    //   game.state.start('Tutorial', true, false, this.main, this.alt);
    // } //uncomment when ready
    if (game.input.keyboard.justPressed(Phaser.KeyCode.FOUR)){
      game.sound.stopAll()﻿;
      game.state.start('BossLevel', true, false, this.main, this.alt);
    }

    if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
      game.sound.stopAll()﻿;
      game.state.start('Settings', true, false, this.main, this.alt);
    }
	}
};