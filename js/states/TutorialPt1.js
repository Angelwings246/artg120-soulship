// Tutorial Part 1 Level State
'use strict';

var frames;

var TutorialPt1 = function(game) {};
TutorialPt1.prototype = {
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

    game.sound.stopAll();
    var timer = 0;
    frames = 0;  
	this.timer = game.time.create(false);
	this.timer.start();
	timer = (Math.floor(this.timer.seconds))+1;

    //spawn some dudes
	this.spawning = this.timer.loop(game.rnd.integerInRange(1000,2000), this.spawn, this);


    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious
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

    //set up sounds
    this.player_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("hit")];
    this.music = game.add.audio("tutorial");
    this.music.play("", 0, this.music_vol, true);
    this.alarm = game.add.audio("alarm");

    this.player = new PlayerShip(game, this.player_sounds, "player", "player ship", this.main, this.alt, this.sfx_vol);
    game.add.existing(this.player);
    this.player.inTutorial = true;
	this.asteroids = game.add.group();

	this.health_bar = new HpBar(game, "hp bar", "hp bar pt 1", "red", 0, this.player);

	//add tentacle 
	this.tentacle = game.add.sprite(game.width/2, -300, 'ball', 0);
	game.physics.enable(this.tentacle, Phaser.Physics.ARCADE);
		this.tentacle.anchor.set(0.5);
		this.tentacle.scale.setTo(2);
		this.tentacle.body.angularVelocity = 300;

	// implement warning signals
	this.timer.add(24000, this.warning1, this);
	this.timer.add(26000, this.warning2, this);
	this.timer.add(28000, this.warning3, this);
    this.timer.add(23500, this.play_sound, this, this.alarm, true);
    this.timer.add(30000, this.player.animations.play, this.player.animations, "warp");
    this.player.warp_anim.onComplete.add(this.ending, this);

	},

	spawn: function(){
	var asteroid;
    var num_asteroids = game.rnd.integerInRange(4, 7); //random number of asteroids
    var asteroid_key;
  	for(let i = 0; i < num_asteroids; i++) {
    
     //switch between the two asteroid assets
     if(i % 2 == 0) asteroid_key = "asteroid2";
     else asteroid_key = "asteroid";
     
     //Enemy(game, x, y, sounds, key, frame)
     asteroid = new Enemy(this.game, this.game.width + Math.random() * 100, Math.random() * this.game.height, this.enemy_sounds, "enemy", asteroid_key, this.sfx_vol, false);
     asteroid.can_fire = false; //turn off the ability for asteroids to shoot bullets
     asteroid.body.velocity.x = game.rnd.integerInRange(-200, -100); 
     asteroid.body.velocity.y = game.rnd.integerInRange(-20, 20); //random velocity
     asteroid.body.angularVelocity = game.rnd.integerInRange(-180,180);
     this.asteroids.add(asteroid);
 	}

	},

	damage: function(character, bullet) {
        //because of naming conventions, this should work for both the enemy AND the player
        if(character.body != null) {
            character.damage(bullet.dmg);
            bullet.destroy(); //destroy instead of kill to free memory
        }
    },

    crashing: function(player, enemy) {
        if(enemy.body != null) {
            player.damage(3); //arbitrary number for now
            enemy.hp = 0; 
        }


    },


  warning1: function(){
	    var warning1 = game.add.bitmapText(game.width/2 , game.height/2 + 220,'aldrich64', '!  <-- WARNING   !', 28);
			warning1.anchor.setTo = 0.5;
			warning1.alpha = 0;
            warning1.tint = 0xFF0000;
			var tween = game.add.tween(warning1).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		},
	warning2: function(){
			var warning2 = game.add.bitmapText(game.width/2 +100 , 250,'aldrich64', 'Unknown Threat Detected', 28);
			warning2.anchor.setTo = 0.5;
			warning2.alpha = 0;
            warning2.tint = 0xFF0000;
			var tween = game.add.tween(warning2).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		},
	warning3: function(){
			var warning3 = game.add.bitmapText(100, 100,'aldrich64', 'COORDINATES SET, \nRECALCULATING', 28);
			warning3.anchor.setTo = 0.5;
			warning3.alpha = 0;
            warning3.tint = 0xFFFF00;
			var tween = game.add.tween(warning3).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		},
    play_sound: function(sound, loop) {
        sound.play('', 0, this.sfx_vol, loop);
    },
	update: function(){
		timer = (Math.floor(this.timer.seconds))+1;
		frames++;

          if(game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()) this.ending();



	if (this.player.hp <= 0 && this.player.death_anim.isFinished) {
        game.sound.stopAll()﻿;
		game.state.start('GameOver', true, false, false, this.main, this.alt, this.music_vol, this.sfx_vol, 'TutorialPt1');;
	}
	game.physics.arcade.overlap(this.asteroids, this.player.bullets, this.damage, null, this);
	game.physics.arcade.overlap(this.player, this.asteroids, this.crashing, null, this);

	//var playerposx;
	//var playerposy;

	if (timer >= 15){
		if (this.spawning != null){
			this.timer.remove(this.spawning);
		}
	}
	if (timer == 20 && frames%32 == 0){

    //locate the player's current position
		this.playerposx = this.player.body.x;
		this.playerposy = this.player.body.y;
		//console.log('posx'+this.playerposx);
		//console.log('posy'+this.playerposy);

	}

	if(timer >= 21 ){

    //lock player movement
		this.player.body.x = this.playerposx;
		this.player.body.y = this.playerposy;
		this.player.body.velocity.x = this.player.body.velocity.y = 0;
        this.player.flame.alpha = 0;
    //move the tentacle through the player's location
		this.tentacle.body.velocity.x = (this.playerposx - game.width/2);
		this.tentacle.body.velocity.y = this.playerposy + 100;

	}

	if(timer >= 23){
		if(this.health_bar.outer.frameName == "hp bar pt 1") this.health_bar.outer.frameName = "hp bar01";
        if(this.player.frameName == "player ship")this.player.frameName = "player ship broken";
        this.health_bar.outer.animations.play("idle");
		}
	},
    ending: function() {
            game.sound.stopAll()﻿;
            game.state.start('Cutscene2', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
};