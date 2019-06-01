// Implements second cutscene in game

'use strict'

var Cutscene1 = function(game){};
Cutscene1.prototype = {
	init: function(main, alt){
	this.main = main;
	this.alt = alt;
},

	preload: function(){

	},

	create: function(){


		this.commdevicescene = game.add.sprite(0, 0, '1commdevice');
		this.asteroidbeltscene = game.add.sprite(0, 0, '2asteroidbelt');
		this.computerwarningblackscene = game.add.sprite(0, 0, '3computerwarningblack');
	  	this.computerwarningdarkerscene = game.add.sprite(0, 0, "3computerwarningdarker");
	    this.computerwarninglighterscene = game.add.sprite(0, 0, "3computerwarninglighter");
	    this.controlsscene = game.add.sprite(0, 0, "4controls");


		var timer = 0;
		this.timer = game.time.create(false);
		this.timer.add(10, this.cutscene, this);
		this.timer.add(5000, this.skiptext, this);
		this.timer.start();
		timer = (Math.floor(this.timer.seconds)+1);

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
		this.tweencontrolsscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		

		// Now CHAIN THESE GUYS
		this.tweencommdevicescene.chain(this.tweenasteroidbeltscene);
		this.tweenasteroidbeltscene.chain(this.tweencomputerwarningblackscene);
		this.tweencomputerwarningblackscene.chain(this.tweencomputerwarningdarkerscene);
		this.tweencomputerwarningdarkerscene.chain(this.tweencomputerwarninglighterscene);
		this.tweencomputerwarninglighterscene.chain(this.tweencontrolsscene);


	},

	skiptext: function(){

		var skiptext = game.add.bitmapText(50, game.height-50, 'aldrich64','Press Q to skip', 20);
		skiptext.alpha = 0;
		var tween = game.add.tween(skiptext). to({alpha: 1}, 4000, Phaser.Easing.Linear.None, true);


	},

	update: function(){

    if (this.timer.seconds > 20 || game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()){ 
	    game.state.start('TutorialPt1', true, false, this.main, this.alt);
	}

	}

};