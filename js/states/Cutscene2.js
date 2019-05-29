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

		var timer = 0;
		this.timer = game.time.create(false);
		this.timer.add(10, this.cutscene, this);
		this.timer.add(4000, this.skiptext, this);
		this.timer.start();
		timer = (Math.floor(this.timer.seconds)+1);

		this.scene1 = game.add.sprite(0, 0, '1alarmsoff');

	},

	cutscene: function(){
		this.scene1.alpha = 0;
		var tween = game.add.tween(this.scene1).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true);

	},

	skiptext: function(){
		var skiptext = game.add.text(game.width/2, game.height-50, 'Press Q to skip', {fontSize: "20px", fill:"#FFFFFF"});
		skiptext.anchor.set(0.5);

	},

	update: function(){

    if (timer >= 25 || game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()){ 
	    game.state.start('TutorialPt2', true, false, this.main, this.alt);
	}

	}

};