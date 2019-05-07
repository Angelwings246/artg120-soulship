// Boss Level State

// be strict
'use strict';
//
//	var frames;
//	var timer;

var BossLevel = function(game){

};
BossLevel.prototype = {
	preload: function(){
		//preload assets
	  game.load.path = "assets/img/";
    game.load.image("background", "bg.png");

    game.load.image("player", "player ship.png");
    game.load.image("enemy", "enemy.png");
    game.load.image("bullet", "bullet.png");
    game.load.image("boss main", "bossVortex.png");
    game.load.image("boss tentacle", "Boss Tentacle.png");
    
    game.load.path = "assets/audio/";
    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);
//    game.load.audio("music", ["music.mp3", "music.ogg"]);
	  

	},
	create: function(){
	  
	  this.background = game.add.sprite(0, 0, "background");

    
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew")];
    
    this.player = new PlayerShip(game, this.enemy_sounds, "player", 0);
    game.add.existing(this.player);
    console.log(this.player);
    //Boss(game, sounds, key_main, frame_main, key_side, frame_side)
    this.boss = new Boss(game, this.enemy_sounds, "boss main", 0, "boss tentacle", 0);
//    this.enemy1 = new Enemy(game, 500, 1/4 * game.height, this.enemy_sounds, "boss main", 0);
    game.add.existing(this.boss);
    
    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux
    this.timer = game.time.create(false);
    this.timer.loop(5000, this.fire, this) //calls once every 10 seconds (10k milliseconds)
    this.timer.start(); //don't forget to start timer

	},
	update: function(){
	  //
//    if(this.enemy1 != null && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
//      this.enemy1.fire();
//    }
		// allow player to start games
		// debug to go to game over
		if (game.input.keyboard.justPressed(Phaser.Keyboard.Q)){
			game.state.start('GameOver');
		}
	},
	fire: function() {
	  this.boss.fire();
	}
};


