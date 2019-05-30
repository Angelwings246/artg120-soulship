// Tutorial Part 1 Level State
'use strict';

var frames;

var Tutorial = function(game) {};
Tutorial.prototype = {
	init: function(main, alt, music_vol, sfx_vol) {
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;

  },
	preload: function() {
		//all preloading done in Load state
  },
	create: function(){

    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious
    var timer = 0;  
	this.timer = game.time.create(false);
	this.timer.add(1000, this.dialogue1, this);
	this.timer.add(4000, this.dialogue2, this);
	this.timer.add(8000, this.dialogue3, this);
	this.timer.add(15000, this.dialogue4, this);
	this.timer.start();
	timer = (Math.floor(this.timer.seconds))+1;
	// allow blackout background w/ text first
	game.stage.backgroundColor = '#000000';
	this.transmission = game.add.audio("transmission");

	},


	dialogue1: function(){
		//Tutorial Dialogue/Instructions
		var intro1 = game.add.text(game.width/2 -200, game.height/2,'Captain! Come in Captain!', {fontSize: "28px", fill:"#FFFFFF"});
		intro1.anchor.setTo = 0.5;
		intro1.alpha = 0;

		var tween = game.add.tween(intro1).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		this.transmission.play("", 0, this.sfx_vol);
	},

	dialogue2: function(){
		//Tutorial Dialogue/Instructions
		var intro2 = game.add.text(game.width/2 -400, game.height/2, 'Get ahold of yourself! You are in the middle of an asteroid belt!', {fontSize: "28px", fill:"#FFFFFF"});
		intro2.anchor.setTo = 0.5;
		intro2.alpha = 0;

		var tween = game.add.tween(intro2).to( {alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
	},

	dialogue3: function(){
		//Tutorial Dialogue/Instructions
		var intro3 = game.add.text(game.width/2 -400, game.height/2 -50, 'Remember how to pilot your ship? \nUse the WASD buttons on your terminal to steer and \nthe OUTER-SPACEBAR to fire your weapons', {fontSize: "28px", fill:"#FFFFFF"});
		intro3.anchor.setTo = 0.5;
		intro3.alpha = 0;

		var tween = game.add.tween(intro3).to( {alpha: 1}, 4000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		this.transmission.play("", 0, this.sfx_vol);

	},

	dialogue4: function(){
		//Tutorial Dialogue/Instructions
		var intro4 = game.add.text(game.width/2 -300, game.height/2, 'Hazards inbound! Be careful Captain, and stay safe. \nWe will reconvene soon.', {fontSize: "28px", fill:"#FFFFFF"});
		intro4.anchor.setTo = 0.5;
		intro4.alpha = 0;
		
		var tween = game.add.tween(intro4).to( {alpha: 1}, 4000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		this.transmission.play("", 0, this.sfx_vol);

	},


	update: function(){
		timer = (Math.floor(this.timer.seconds))+1;

    if (timer >= 25 || game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()){ 
	    game.state.start('TutorialPt1', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
	}

	}
};