// Implements second cutscene in game

'use strict'

var Cutscene3 = function(game){};
Cutscene3.prototype = {
	init: function(main, alt, music_vol, sfx_vol){
	this.main = main;
	this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
},

	preload: function(){

	},

	create: function(){
    game.sound.stopAll()﻿;

		// cutscene images
		this.shipscene = game.add.sprite(0, 0, '1ship');
		this.voidscene = game.add.sprite(0, 0, '2void');
		this.massscene = game.add.sprite(0, 0, '3tentaclemass');

		// add audio
		this.transmission = game.add.audio("transmission");
    	this.alarm = game.add.audio("alarm");
    	this.spooky = game.add.audio("cutscene2")


		var timer = 0;
		this.timer = game.time.create(false);
		this.timer.add(0, this.cutscene, this);
		this.timer.add(1000, this.cutscenetext, this);
		this.timer.add(3000, this.skiptext, this);
		this.timer.start();

		this.timer.add(0, this.play_sound, this, this.transmission, false);
	  this.timer.add(8000, this.play_sound, this, this.transmission, false);

		game.add.audio("cutscene2").play("", 0 , this.music_vol, true);


	},

	cutscene: function(){
		// from Nathan Altice's tweens slides
		// names are the names of the frames + scene 
		// .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
		// first scene
		this.shipscene.alpha = 0;
		this.tweenshipscene = game.add.tween(this.shipscene);
		this.tweenshipscene.to( {alpha: 1}, 4000, Phaser.Easing.Linear.None, 2000);

		// Now set up the rest of the scenes!
		// Alpha is set to 0 to allow fade in to alpha: 1
		// Can adjust the Easing for cool effects
		this.voidscene.alpha = 0;
		this.tweenvoidscene = game.add.tween(this.voidscene);
		this.tweenvoidscene.to( {alpha: 1}, 4000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.massscene.alpha = 0;
		this.tweenmassscene = game.add.tween(this.massscene);
		this.tweenmassscene.to( {alpha:1}, 4000, Phaser.Easing.Linear.None, false, 1000, 0);


		

		// Now CHAIN THESE GUYS
		this.tweenshipscene.chain(this.tweenvoidscene);
		this.tweenvoidscene.chain(this.tweenmassscene);


	},

	cutscenetext: function(){
		//Tutorial Dialogue/Instructions
		//this.blank = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);

		// .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
		this.intro1 = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '"That was intense, but at least it\'s over!"', 28);
		this.intro1.alpha = 0;
		this.intro1.anchor.set(0.5);
		this.tween01 = game.add.tween(this.intro1);
		this.tween01.to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);


		this.intro2 = game.add.bitmapText(game.width/2, game.height/2 , 'aldrich64', '"Hold on, what is THAT?!"', 72);
		this.intro2.alpha = 0;
		this.intro2.anchor.set(0.5);
		this.tween02 = game.add.tween(this.intro2);
		this.tween02.to( {alpha: 1}, 2500, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.intro3 = game.add.bitmapText(game.width/2-120, game.height/2-200, 'aldrich64','"Oh...oh god..."', 36);
		this.intro3.alpha = 0;
		this.intro3.anchor.set(0.5);
		this.tween03 = game.add.tween(this.intro3);
		this.tween03.to( {alpha: 1}, 4000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		// optional blank text for timing padding
		// this.blank = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);
		// this.blank.alpha = 0;
		// this.blank.anchor.setTo = 0.5;
		// this.tweenblank = game.add.tween(this.blank);
		// this.tweenblank.to( {alpha: 1}, 3000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.tween01.chain(this.tween02);
		this.tween02.chain(this.tween03);


		this.transmission.play('', 0, this.sfx_vol, false);

	},

	skiptext: function(){

		var skiptext = game.add.bitmapText(50, game.height-50, 'aldrich64','Press X to skip', 28);
		skiptext.alpha = 0;
		var tween = game.add.tween(skiptext). to({alpha: 1}, 4000, Phaser.Easing.Linear.None, true);


	},	
	play_sound: function(sound, loop) {
		sound.play('', 0, this.sfx_vol, loop);
	},

	update: function(){

    if (this.timer.seconds > 16 || game.input.keyboard.addKey(Phaser.KeyCode.X).justPressed()){ 
      game.sound.stopAll()﻿;
	    game.state.start('BossLevel', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
	}

	}

};