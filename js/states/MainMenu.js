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
   //  //preload assets
	  // game.load.path = "assets/img/";
   //  game.load.image("background", "bg.png");
   //  game.load.bitmapFont("aldrich64", "aldrich64.png", "aldrich64.fnt");
   //  // load Main Menu theme
   //    game.load.path = "assets/audio/";
   //  game.load.audio("MainMenu", ["MainMenu.mp3", "MainMenu.ogg"], 1, true);

	},
	create: function(){
		// game.stage.backgroundColor = '#facade';
		game.add.image(0, 0, "background");
		var titleText = game.add.bitmapText(game.width/4, game.height/2 - 25, "aldrich64", 'Soul Ship', 64);
		var instructionText = game.add.bitmapText(game.width/4, game.height/2 + 50,"aldrich64", 'Press SPACEBAR to start', 32);
		// var controlsText = game.add.text(game.width/2, game.height/2 + 150, 'Use WASD to move');
		this.MainMenu = game.add.audio("MainMenu");
		this.MainMenu.play('', 0, 1, true);

    game.add.text(10, 10, "Debug: ESC for settings, 1 to skip to Tut1, 2 to skip to Tut2, 3 to skip to Lvl1, 4 to skip to Boss", {fontSize: "12px", fill:"#FFFFFF"});
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.KeyCode.SPACEBAR)){
      game.sound.stopAll()﻿;
			game.state.start('Tutorial', true, false, this.main, this.alt);
		}

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