// Implements second cutscene in game

'use strict'

var Cutscene2 = function(game){};
Cutscene2.prototype = {
	init: function(main, alt, music_vol, sfx_vol){
	this.main = main;
	this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
},

	preload: function(){

	},

	create: function(){


		// add cutscene images
		this.alarmsoffscene = game.add.sprite(0, 0, '1alarmsoff');
		this.alarmsonscene = game.add.sprite(0, 0, '1alarmson');
		this.alarmsraysscene = game.add.sprite(0, 0, '1alarmsrays');
	  	this.computerblackscene = game.add.sprite(0, 0, "2_12computerwarningblack");
	    this.computerdarkerscene = game.add.sprite(0, 0, "2_12computerwarningdarker");
	    this.computerlighterscene = game.add.sprite(0, 0, "2_12computerwarninglighter");
	    this.tentacleattackoffscene = game.add.sprite(0, 0, "3tentaclesattackoff");
	    this.tentacleattackonscene = game.add.sprite(0, 0, "3tentaclesattackon");
	    this.tentacleattackraysscene = game.add.sprite(0, 0, "3tentaclesattackrays");
	    this.commdevicescene = game.add.sprite(0, 0, "4commdevice");
	    this.monsterscene = game.add.sprite(0, 0, "5monster");
	    this.firebuttonscene = game.add.sprite(0, 0, "6firebutton");
	    this.firebuttondownscene = game.add.sprite(0, 0, '7firebuttonpusheddown');
	    this.shipfiresscene = game.add.sprite(0, 0, '8shipfires');
	    this.tentaclesadvanceoffscene = game.add.sprite(0, 0, '9tentaclesadvanceoff');
	    this.tentaclesadvanceonscene = game.add.sprite(0, 0, '9tentaclesadvanceon');
	    this.tentaclesadvanceraysscene = game.add.sprite(0, 0, '9tentaclesadvancerays');
	    this.shipattackedscene = game.add.sprite(0, 0, '10shipattacked');
	    this.monsterexplodesscene = game.add.sprite(0, 0, '11monsterexplodes');
		this.fullattackscene = game.add.sprite(0, 0, '13fullattack');

		// add audio files
		this.transmission = game.add.audio("transmission");
		this.pew = game.add.audio("pew");
		this.damaged = game.add.audio("ouch");
		this.boom = game.add.audio("boom"); 
		this.alarm = game.add.audio("alarm");

		var timer = 0;
		this.timer = game.time.create(false);
		this.timer.add(0, this.cutscene, this);
		this.timer.add(10000, this.cutscenetext, this);
		this.timer.add(5000, this.skiptext, this);
		this.timer.start();
		timer = (Math.floor(this.timer.seconds)+1);

		game.add.audio("cutscene2").play("", 0 , this.music_vol, true);
		this.timer.add(14000, this.play_sound, this, this.transmission, false);
		this.timer.add(25000, this.play_sound, this, this.transmission, false);
		this.timer.add(500, this.play_sound, this, this.alarm, true);
		this.timer.add(34000, this.play_sound, this, this.pew, false);
		this.timer.add(38000, this.play_sound, this, this.damaged, false);
		this.timer.add(45000, this.play_sound, this, this.damaged, false);
		this.timer.add(48000, this.play_sound, this, this.boom, false);
		this.timer.add(32250, this.alarm.pause, this.alarm);
		this.timer.add(36500, this.alarm.resume, this.alarm);
		this.timer.add(44250, this.alarm.pause, this.alarm);
		this.timer.add(45000, this.play_sound, this, this.transmission, false);
		this.timer.add(54500, this.play_sound, this, this.transmission, false);


	},

	update: function(){

    if (this.timer.seconds > 65 || game.input.keyboard.addKey(Phaser.KeyCode.X).justPressed()){ 
    	game.sound.stopAll();
	    game.state.start('TutorialPt2', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
	  }
  },

	cutscene: function(){
		// from Nathan Altice's tweens slides
		// names are the names of the frames + scene 
		// .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
		// first scene
		this.alarmsoffscene.alpha = 0;
		this.tweenalarmsoffscene = game.add.tween(this.alarmsoffscene);
		this.tweenalarmsoffscene.to( {alpha: 1}, 1000, Phaser.Easing.Linear.None, 2000);

		// Now set up the rest of the scenes!
		// Alpha is set to 0 to allow fade in to alpha: 1
		// Can adjust the Easing for cool effects
		this.alarmsonscene.alpha = 0;
		this.tweenalarmsonscene = game.add.tween(this.alarmsonscene);
		this.tweenalarmsonscene.to( {alpha: 1}, 1000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.alarmsraysscene.alpha = 0;
		this.tweenalarmsraysscene = game.add.tween(this.alarmsraysscene);
		this.tweenalarmsraysscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 2, true);


	  	this.computerblackscene.alpha = 0;
		this.tweencomputerblackscene = game.add.tween(this.computerblackscene);
		this.tweencomputerblackscene.to( {alpha:1}, 1000, Phaser.Easing.Linear.None, false, 1000, 0);


	  	this.computerdarkerscene.alpha = 0;
		this.tweencomputerdarkerscene = game.add.tween(this.computerdarkerscene);
		this.tweencomputerdarkerscene.to( {alpha:1}, 1000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.computerlighterscene.alpha = 0;
		this.tweencomputerlighterscene = game.add.tween(this.computerlighterscene);
		this.tweencomputerlighterscene.to( {alpha:1}, 1000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentacleattackoffscene.alpha = 0;
		this.tweententacleattackoffscene = game.add.tween(this.tentacleattackoffscene);
		this.tweententacleattackoffscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentacleattackonscene.alpha = 0;
		this.tweententacleattackonscene = game.add.tween(this.tentacleattackonscene);
		this.tweententacleattackonscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentacleattackraysscene.alpha = 0;
		this.tweententacleattackraysscene = game.add.tween(this.tentacleattackraysscene);
		this.tweententacleattackraysscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 2, true);


		this.commdevicescene.alpha = 0;
		this.tweencommdevicescene = game.add.tween(this.commdevicescene);
		this.tweencommdevicescene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.monsterscene.alpha = 0;
		this.tweenmonsterscene = game.add.tween(this.monsterscene);
		this.tweenmonsterscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.firebuttonscene.alpha = 0;
		this.tweenfirebuttonscene = game.add.tween(this.firebuttonscene);
		this.tweenfirebuttonscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 0);


		this.firebuttondownscene.alpha = 0;
		this.tweenfirebuttondownscene = game.add.tween(this.firebuttondownscene);
		this.tweenfirebuttondownscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 0);


		this.shipfiresscene.alpha = 0;
		this.tweenshipfiresscene = game.add.tween(this.shipfiresscene);
		this.tweenshipfiresscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentaclesadvanceoffscene.alpha = 0;
		this.tweententaclesadvanceoffscene = game.add.tween(this.tentaclesadvanceoffscene);
		this.tweententaclesadvanceoffscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentaclesadvanceonscene.alpha = 0;
		this.tweententaclesadvanceonscene = game.add.tween(this.tentaclesadvanceonscene);
		this.tweententaclesadvanceonscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentaclesadvanceraysscene.alpha = 0;
		this.tweententaclesadvanceraysscene = game.add.tween(this.tentaclesadvanceraysscene);
		this.tweententaclesadvanceraysscene.to( {alpha:1}, 500, Phaser.Easing.Linear.None, false, 1000, 2, true);


		this.shipattackedscene.alpha = 0;
		this.tweenshipattackedscene = game.add.tween(this.shipattackedscene);
		this.tweenshipattackedscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.monsterexplodesscene.alpha = 0;
		this.tweenmonsterexplodesscene = game.add.tween(this.monsterexplodesscene);
		this.tweenmonsterexplodesscene.to( {alpha:1}, 7000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.fullattackscene.alpha = 0;
		this.tweenfullattackscene = game.add.tween(this.fullattackscene);
		this.tweenfullattackscene.to( {alpha:1}, 5000, Phaser.Easing.Linear.None, false, 2000, 0);


		// Now CHAIN THESE GUYS
		this.tweenalarmsoffscene.chain(this.tweenalarmsonscene);
		this.tweenalarmsonscene.chain(this.tweenalarmsraysscene);
		this.tweenalarmsraysscene.chain(this.tweencomputerblackscene);
		this.tweencomputerblackscene.chain(this.tweencomputerdarkerscene);
		this.tweencomputerdarkerscene.chain(this.tweencomputerlighterscene);
		this.tweencomputerlighterscene.chain(this.tweententacleattackoffscene);
		this.tweententacleattackoffscene.chain(this.tweententacleattackonscene);
		this.tweententacleattackonscene.chain(this.tweententacleattackraysscene);
		this.tweententacleattackraysscene.chain(this.tweencommdevicescene);
		this.tweencommdevicescene.chain(this.tweenmonsterscene);
		this.tweenmonsterscene.chain(this.tweenfirebuttonscene);
		this.tweenfirebuttonscene.chain(this.tweenfirebuttondownscene);
		this.tweenfirebuttondownscene.chain(this.tweenshipfiresscene);
		this.tweenshipfiresscene.chain(this.tweententaclesadvanceoffscene);
		this.tweententaclesadvanceoffscene.chain(this.tweententaclesadvanceonscene);
		this.tweententaclesadvanceonscene.chain(this.tweententaclesadvanceraysscene);
		this.tweententaclesadvanceraysscene.chain(this.tweenshipattackedscene);
		this.tweenshipattackedscene.chain(this.tweenmonsterexplodesscene);
		this.tweenmonsterexplodesscene.chain(this.tweenfullattackscene);


	},

		cutscenetext: function(){
		//Tutorial Dialogue/Instructions


		// .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
		this.text1 = game.add.bitmapText(game.width/2-400, game.height/2-200, 'aldrich64', 'WARNING: Unknown Threat Detected \nWARNING: Hull Integrity Low \nWARNING: Engines Damaged', 36);
		this.text1.alpha = 0;
		this.text1.anchor.setTo = 0.5;
		this.tween01 = game.add.tween(this.text1);
		this.tween01.to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);


		this.text2 = game.add.bitmapText(game.width/2, game.height/2 , 'aldrich64', '"Captain! It looks like something is coming..."', 36);
		this.text2.alpha = 0;
		this.text2.anchor.set(0.5);
		this.tween02 = game.add.tween(this.text2);
		this.tween02.to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.blank01 = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);
		this.blank01.alpha = 0;
		this.blank01.anchor.setTo = 0.5;
		this.tweenblank01 = game.add.tween(this.blank01);
		this.tweenblank01.to( {alpha: 1}, 3000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.text3 = game.add.bitmapText(game.width/2, game.height/2-50, 'aldrich64','"Shields malfunctioning, engines damaged?!  What do we do?"', 36);
		this.text3.alpha = 0;
		this.text3.anchor.set(0.5);
		this.tween03 = game.add.tween(this.text3);
		this.tween03.to( {alpha: 1}, 2500, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.blank02 = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64', '', 20);
		this.blank02.alpha = 0;
		this.blank02.anchor.setTo = 0.5;
		this.tweenblank02 = game.add.tween(this.blank02);
		this.tweenblank02.to( {alpha: 1}, 5000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.text4 = game.add.bitmapText(game.width/2, game.height/2, 'aldrich64','Warning: Hull Integrity Low', 42);
		this.text4.alpha = 0;
		this.text4.anchor.set(0.5);
		this.tween04 = game.add.tween(this.text4);
		this.tween04.to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.text5 = game.add.bitmapText(game.width/2-75, game.height/2, 'aldrich64','"Captain, it looks like EVERY SHOT we take \nbrings our ship closer to being torn to pieces!\nI don\'t know how much more we can handle..."', 32);
		this.text5.alpha = 0;
		this.text5.anchor.set(0.5);
		this.tween05 = game.add.tween(this.text5);
		this.tween05.to( {alpha: 1}, 7000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);


		this.text6 = game.add.bitmapText(game.width/2, game.height/2-50, 'aldrich64','"...but it looks like we\'re just getting started..."', 28);
		this.text6.alpha = 0;
		this.text6.anchor.set(0.5);
		this.tween06 = game.add.tween(this.text6);
		this.tween06.to( {alpha: 1}, 3000, Phaser.Easing.Bounce.InOut, false, 0, 0, true);




		//this.tweenblank01.chain(this.tween01);
		this.tween01.chain(this.tween02);
		this.tween02.chain(this.tweenblank01);
		this.tweenblank01.chain(this.tween03);
		this.tween03.chain(this.tweenblank02);
		this.tweenblank02.chain(this.tween04);
		this.tween04.chain(this.tween05);
		this.tween05.chain(this.tween06);

		// this.transmission.play();

	},

	skiptext: function(){

		var skiptext = game.add.bitmapText(50, game.height-50, 'aldrich64','Press X to skip', 28);
		skiptext.alpha = 0;
		var tween = game.add.tween(skiptext). to({alpha: 1}, 4000, Phaser.Easing.Linear.None, true);


	},
	play_sound: function(sound, loop) {
		sound.play('', 0, this.sfx_vol, loop);
	}


};