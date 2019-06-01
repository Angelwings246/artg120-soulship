// Implements second cutscene in game

'use strict'

var Cutscene2 = function(game){};
Cutscene2.prototype = {
	init: function(main, alt){
	this.main = main;
	this.alt = alt;
},

	preload: function(){

	},

	create: function(){


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
		this.alarmsoffscene.alpha = 0;
		this.tweenalarmsoffscene = game.add.tween(this.alarmsoffscene);
		this.tweenalarmsoffscene.to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, 2000);

		// Now set up the rest of the scenes!
		// Alpha is set to 0 to allow fade in to alpha: 1
		// Can adjust the Easing for cool effects
		this.alarmsonscene.alpha = 0;
		this.tweenalarmsonscene = game.add.tween(this.alarmsonscene);
		this.tweenalarmsonscene.to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.alarmsraysscene.alpha = 0;
		this.tweenalarmsraysscene = game.add.tween(this.alarmsraysscene);
		this.tweenalarmsraysscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 2, true);


	  	this.computerblackscene.alpha = 0;
		this.tweencomputerblackscene = game.add.tween(this.computerblackscene);
		this.tweencomputerblackscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


	  	this.computerdarkerscene.alpha = 0;
		this.tweencomputerdarkerscene = game.add.tween(this.computerdarkerscene);
		this.tweencomputerdarkerscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.computerlighterscene.alpha = 0;
		this.tweencomputerlighterscene = game.add.tween(this.computerlighterscene);
		this.tweencomputerlighterscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentacleattackoffscene.alpha = 0;
		this.tweententacleattackoffscene = game.add.tween(this.tentacleattackoffscene);
		this.tweententacleattackoffscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentacleattackonscene.alpha = 0;
		this.tweententacleattackonscene = game.add.tween(this.tentacleattackonscene);
		this.tweententacleattackonscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentacleattackraysscene.alpha = 0;
		this.tweententacleattackraysscene = game.add.tween(this.tentacleattackraysscene);
		this.tweententacleattackraysscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.commdevicescene.alpha = 0;
		this.tweencommdevicescene = game.add.tween(this.commdevicescene);
		this.tweencommdevicescene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.monsterscene.alpha = 0;
		this.tweenmonsterscene = game.add.tween(this.monsterscene);
		this.tweenmonsterscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.firebuttonscene.alpha = 0;
		this.tweenfirebuttonscene = game.add.tween(this.firebuttonscene);
		this.tweenfirebuttonscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.firebuttondownscene.alpha = 0;
		this.tweenfirebuttondownscene = game.add.tween(this.firebuttondownscene);
		this.tweenfirebuttondownscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.shipfiresscene.alpha = 0;
		this.tweenshipfiresscene = game.add.tween(this.shipfiresscene);
		this.tweenshipfiresscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentaclesadvanceoffscene.alpha = 0;
		this.tweententaclesadvanceoffscene = game.add.tween(this.tentaclesadvanceoffscene);
		this.tweententaclesadvanceoffscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentaclesadvanceonscene.alpha = 0;
		this.tweententaclesadvanceonscene = game.add.tween(this.tentaclesadvanceonscene);
		this.tweententaclesadvanceonscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.tentaclesadvanceraysscene.alpha = 0;
		this.tweententaclesadvanceraysscene = game.add.tween(this.tentaclesadvanceraysscene);
		this.tweententaclesadvanceraysscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.shipattackedscene.alpha = 0;
		this.tweenshipattackedscene = game.add.tween(this.shipattackedscene);
		this.tweenshipattackedscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.monsterexplodesscene.alpha = 0;
		this.tweenmonsterexplodesscene = game.add.tween(this.monsterexplodesscene);
		this.tweenmonsterexplodesscene.to( {alpha:1}, 2000, Phaser.Easing.Linear.None, false, 1000, 0);


		this.fullattackscene.alpha = 0;
		this.tweenfullattackscene = game.add.tween(this.fullattackscene);
		this.tweenfullattackscene.to( {alpha:1}, 3000, Phaser.Easing.Linear.None, false, 2000, 0);


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

	skiptext: function(){

		var skiptext = game.add.bitmapText(50, game.height-50, 'aldrich64','Press Q to skip', 20);
		skiptext.alpha = 0;
		var tween = game.add.tween(skiptext). to({alpha: 1}, 4000, Phaser.Easing.Linear.None, true);


	},

	update: function(){

    if (this.timer.seconds > 72 || game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()){ 
	    game.state.start('TutorialPt2', true, false, this.main, this.alt);
	}

	}

};