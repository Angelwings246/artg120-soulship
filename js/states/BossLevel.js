// Boss Level State

// be strict
'use strict';
//
//	var frames;
//	var timer;

var BossLevel = function(game){
    this.ENEMY_DMG = 2; //keep as a constant for easier balancing

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

    //set up sounds
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew")];

    //Boss(game, sounds, key_main, frame_main, key_side, frame_side)
    this.boss = new Boss(game, this.enemy_sounds, "boss main", 0, "boss tentacle", 0);
    game.add.existing(this.boss);

    //Playership(game, sounds, key, frame)    
    this.player = new PlayerShip(game, this.enemy_sounds, "player", 0);
    game.add.existing(this.player);
    console.log(this.player);
    
    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux
    this.timer = game.time.create(false);
    this.timer.loop(5000, this.fire, this) //calls once every 10 seconds (10k milliseconds)
    this.timer.start(); //don't forget to start timer

    //text to show HP before we get bars working
    this.player_hp_text = game.add.text(game.width/8, game.height - 100,"Player HP: " + this.player.hp, {fontSize: "32px", fill:"#FFFFFF"});
    this.boss_hp_text = game.add.text(3* game.width/4, game.height - 100,"Boss HP: " + this.boss.hp, {fontSize: "32px", fill:"#FFFFFF"});

    this.victory = false; //switch to true if the player wins

	},
	update: function() {
      //collision checks 
      game.physics.arcade.overlap(this.player, this.boss.bullets, this.damage);
      game.physics.arcade.overlap(this.boss, this.player.bullets, this.damage);
      //NOTE: Boss is an extension of Phaser.Group, so this should work.  Hopefully.

    //update text
    this.player_hp_text.text = "Player HP: " + this.player.hp; //update each frame because we don't know when the player will fire
    this.boss_hp_text.text = "Boss HP: " + this.boss.hp; 

		// allow player to start games
		// debug to go to game over
		if(this.player.hp <= 0 || this.boss.hp <= 0 || game.input.keyboard.justPressed(Phaser.Keyboard.Q)){
			if(this.boss.hp <= 0) this.victory = true;
            game.state.start('GameOver', true, false, this.victory);
		}
	},
	fire: function() {
	  this.boss.fire(); //simply call the fire function of boss, which has all of the functionality set up
	  console.log(this.boss.bullets);
    },
    damage: function(character, bullet) {
        //because of naming conventions, this should work for both the enemy AND the player
        if(character.body != null) {
            character.damage(bullet.dmg);
            bullet.destroy(); //destroy instead of kill to free memory
        }
    },

};


