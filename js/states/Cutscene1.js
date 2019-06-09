// Implements second cutscene in game

'use strict'

var Cutscene1 = function(game){};
Cutscene1.prototype = {
	init: function(main, alt, music_vol, sfx_vol){
	  this.main = main;
	  this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
  },
	preload: function(){
		//all loading done in Load state
	},
	create: function(){
		// cutscene images
		this.commdevicescene = game.add.sprite(0, 0, '1commdevice');
		this.asteroidbeltscene = game.add.sprite(0, 0, '2asteroidbelt');
		this.computerwarningblackscene = game.add.sprite(0, 0, '3computerwarningblack');
	  this.computerwarningdarkerscene = game.add.sprite(0, 0, "3computerwarningdarker");
	  this.computerwarninglighterscene = game.add.sprite(0, 0, "3computerwarninglighter");
	  this.controlsscene = game.add.sprite(0, 0, "4controls");

	    // cutscene text
	 //    this.intro1 = game.add.bitmapText(game.width/2 -200, game.height/2, 'aldrich64', 'Captain! Come in Captain! We are approaching an asteroid belt!', 28);
		// this.intro2 = game.add.bitmapText(game.width/2 -400, game.height/2 -50, 'aldrich64', 'Hazards inbound!', 28);
		// this.intro3 = game.add.bitmapText(game.width/2 -300, game.height/2, 'aldrich64','Hope you remember how to pilot this thing. Be careful!', 28);
		// this.blank = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);

		// add audio
		this.transmission = game.add.audio("transmission");
    this.alarm = game.add.audio("alarm");

		var timer = 0;
		this.timer = game.time.create(false);
		this.timer.add(0, this.cutscene, this);
		this.timer.add(1000, this.cutscenetext, this);
		this.timer.add(5000, this.skiptext, this);
		this.timer.start();
		timer = (Math.floor(this.timer.seconds)+1);
	},
	update: function(){
    if (this.timer.seconds > 26 || game.input.keyboard.addKey(Phaser.KeyCode.X).justPressed()){ 
      game.sound.stopAll()﻿;
	    game.state.start('TutorialPt1', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
	  }
  },
	cutscene: function(){
		// from Nathan Altice's tweens slides
		// names are the names of the frames + scene 
		// .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
		// first scene
		this.commdevicescene.alpha = 0;
		this.tweencommdevicescene = game.add.tween(this.commdevicescene);
		this.tweencommdevicescene.to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, 2000);

		// Now set up the rest of the scenes!
		// Alpha is set to 0 to allow fade in to alpha: 1
		// Can adjust the Easing for cool effects
		this.asteroidbeltscene.alpha = 0;
		this.tweenasteroidbeltscene = game.add.tween(this.asteroidbeltscene);
		this.tweenasteroidbeltscene.to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);

		this.computerwarningblackscene.alpha = 0;
		this.tweencomputerwarningblackscene = game.add.tween(this.computerwarningblackscene);
		this.tweencomputerwarningblackscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);

	  this.computerwarningdarkerscene.alpha = 0;
		this.tweencomputerwarningdarkerscene = game.add.tween(this.computerwarningdarkerscene);
		this.tweencomputerwarningdarkerscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);

	  this.computerwarninglighterscene.alpha = 0;
		this.tweencomputerwarninglighterscene = game.add.tween(this.computerwarninglighterscene);
		this.tweencomputerwarninglighterscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);

		this.controlsscene.alpha = 0;
		this.tweencontrolsscene = game.add.tween(this.controlsscene);
		this.tweencontrolsscene.to( {alpha:1}, 8000, Phaser.Easing.Linear.None, false, 1000, 0);

		// Now CHAIN THESE GUYS
		this.tweencommdevicescene.chain(this.tweenasteroidbeltscene);
		this.tweenasteroidbeltscene.chain(this.tweencomputerwarningblackscene);
		this.tweencomputerwarningblackscene.chain(this.tweencomputerwarningdarkerscene);
		this.tweencomputerwarningdarkerscene.chain(this.tweencomputerwarninglighterscene);
		this.tweencomputerwarninglighterscene.chain(this.tweencontrolsscene);
	},
	cutscenetext: function(){
		//Tutorial Dialogue/Instructions
		//this.blank = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);

		// .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
		this.intro1 = game.add.bitmapText(game.width/2-400, game.height/2-100, 'aldrich64', '"Captain! Come in Captain! We\'re approaching an asteroid belt!"', 28);
		this.intro1.alpha = 0;
		this.intro1.anchor.setTo = 0.5;
		this.tween01 = game.add.tween(this.intro1);
		this.tween01.to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);

		this.blank = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);
		this.blank.alpha = 0;
		this.blank.anchor.setTo = 0.5;
		this.tweenblank = game.add.tween(this.blank);
		this.tweenblank.to( {alpha: 1}, 3000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);

		this.intro2 = game.add.bitmapText(game.width/2, game.height/2 , 'aldrich64', 'Hazards inbound!', 72);
		this.intro2.alpha = 0;
		this.intro2.anchor.set(0.5);
		this.tween02 = game.add.tween(this.intro2);
		this.tween02.to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);

		this.intro3 = game.add.bitmapText(game.width/2-120, game.height/2-200, 'aldrich64','"Hope you remember how to pilot this thing.\nBe careful!"', 28);
		this.intro3.alpha = 0;
		this.intro3.anchor.set(0.5);
		this.tween03 = game.add.tween(this.intro3);
		this.tween03.to( {alpha: 1}, 7000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);

		this.tween01.chain(this.tweenblank);
		this.tweenblank.chain(this.tween02);
		this.tween02.chain(this.tween03);

		this.transmission.play('', 0, this.sfx_vol, false);

	},
	skiptext: function(){
		var skiptext = game.add.bitmapText(50, game.height-50, 'aldrich64','Press X to skip', 28);
		skiptext.alpha = 0;
		var tween = game.add.tween(skiptext). to({alpha: 1}, 4000, Phaser.Easing.Linear.None, true);
		this.alarm.play('', 0, this.sfx_vol, true);
	}
};