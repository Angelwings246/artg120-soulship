// Tutorial Part 1 Level State
'use strict';

var frames;

var TutorialPt1 = function(game) {};
TutorialPt1.prototype = {
	preload: function() {
    //preload assets

    // load images
    game.load.path = "assets/img/";
    game.load.image("background", "bg.png");
    game.load.image("player", "player ship.png");
    game.load.image("bullet", "bullet.png");
    game.load.image("enemy", "enemy.png");
    game.load.image("asteroid", "Asteroid.png");
    game.load.image("asteroid2", "Asteroid2.png");
    game.load.image("stars", "Stars.png");
    game.load.image("stars2", "Stars2.png");
    game.load.image("heal", "hpDrop.png");
    game.load.image("hp barpt1", "hp bar pt 1.png");
    game.load.image("red", "hp red.png");

    // load audio
    game.load.path = "assets/audio/";

    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);
    game.load.audio("ouch", ["PlayerGetsHit.mp3"]);
    game.load.audio("panic", ["LowHP.mp3", "LowHP.ogg"], 1, true);
    game.load.audio("hit boss", ["EnemyGetsHit.mp3"]);
    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);

    game.load.audio("intro", ["music intro.mp3", "music intro.ogg"]);
    game.load.audio("loop", ["music loop.mp3", "music loop.ogg"]);

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

    	this.player_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];

    this.player = new PlayerShip(game, this.player_sounds, "player", 0);
    game.add.existing(this.player);
    this.player.inTutorial = true;

    this.health_bar = game.add.image(115, 542, "red");
    this.hp_width = 298; 
    game.add.image(100, 525, "hp bar");


	},

	dialogue1: function(){
		//Tutorial Dialogue/Instructions
		var intro1 = game.add.text(game.width/2 -200, game.height/2,'Captain! Come in Captain!', {fontSize: "28px", fill:"#FFFFFF"});
		intro1.anchor.setTo = 0.5;
		intro1.alpha = 0;

		var tween = game.add.tween(intro1).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
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
		var intro3 = game.add.text(game.width/2 -400, game.height/2 -50, 'Remember how to pilot your ship? \nUse the WASD buttons on your terminal to steer and \nthe OUTER-spacebar to fire your weapons', {fontSize: "28px", fill:"#FFFFFF"});
		intro3.anchor.setTo = 0.5;
		intro3.alpha = 0;
		var tween = game.add.tween(intro3).to( {alpha: 1}, 4000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
	},

	dialogue4: function(){
		//Tutorial Dialogue/Instructions
		var intro4 = game.add.text(game.width/2 -300, game.height/2, 'Hazards inbound! Be careful Captain, and stay safe. \nWe will reconvene soon.', {fontSize: "28px", fill:"#FFFFFF"});
		intro4.anchor.setTo = 0.5;
		intro4.alpha = 0;
		
		var tween = game.add.tween(intro4).to( {alpha: 1}, 4000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
	},


	update: function(){
		timer = (Math.floor(this.timer.seconds))+1;
		console.log(timer);
    if (timer >= 25){ 
    	this.background = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "background");
    	this.background.autoScroll(-50, 0);
    	game.add.existing(this.background);
    	this.stars = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars");
    	this.stars.autoScroll(-100, 0);
    	this.stars.alpha = 0.9;
    	game.add.existing(this.stars);
    	this.stars2 = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars2");
    	this.stars2.autoScroll(-125, 0);
    	game.add.existing(this.stars2);
    	this.stars2.alpha = 0.4;
	}




	}
};