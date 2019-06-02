// MainMenu state

var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function(main, alt, music_vol, sfx_vol) {
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
	},
	preload: function() {
   //all preloading done in Load.js
	},
	create: function() {
		// game.stage.backgroundColor = '#facade';
		game.add.image(0, 0, "background");
		var titleText = game.add.bitmapText(game.width/4, game.height/4, "aldrich64", 'Soul Ship', 96);

    //buttons
    this.start = game.add.button(game.width/3, game.height/2, "start adventure", this.changeState, this);

		this.settings = game.add.button(game.width/3, 2*game.height/3, "options", this.changeState, this);

    this.credits = game.add.button(game.width/3, 5*game.height/6, "credits",this.changeState, this);

    //music
		this.MainMenu = game.add.audio("MainMenu");
		this.MainMenu.play("", 0, this.music_vol, true);
    game.add.text(10, 10, "Debug: ESC for settings, 1 to skip to Tut1, 2 to skip to Tut2, 3 to skip to Lvl1, 4 to skip to Boss. Credits don't work.", {fontSize: "12px", fill:"#FFFFFF"});
	},
	update: function() {

    //-----DEBUG: REMOVE IN FINAL BUILD-----//
    if (game.input.keyboard.justPressed(Phaser.KeyCode.ONE)){
      game.sound.stopAll()﻿;
      game.state.start('TutorialPt1', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
    if (game.input.keyboard.justPressed(Phaser.KeyCode.TWO)){
      game.sound.stopAll()﻿;
      game.state.start('TutorialPt2', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
    if (game.input.keyboard.justPressed(Phaser.KeyCode.THREE)){
      game.sound.stopAll()﻿;
      game.state.start('Level1', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    } 
    if (game.input.keyboard.justPressed(Phaser.KeyCode.FOUR)){
      game.sound.stopAll()﻿;
      game.state.start('BossLevel', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }

    if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
      game.sound.stopAll()﻿;
      game.state.start('Settings', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
	},
  //detects which button was pressed and goes to the corresponding state
  changeState: function(button, pointer, isOver) {
    var state;
    switch(button) {
      case this.start:
        state = "Cutscene1";
        break;
      case this.settings:
        state = "Settings";
        break;
      case this.credits:
        state = "Settings";
        break;
      default:
        break; 
    }
    game.sound.stopAll()﻿;
    game.state.start(state, true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
  }
};