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
    game.load.image("hp bar", "hp bar pt 1.png");
    game.load.image("corrupt bar", "hp bar.png");
    game.load.image("red", "hp red.png");
    game.load.image("tentacle", "tentacle.png");

    // load audio
    game.load.path = "assets/audio/";

    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);
    game.load.audio("ouch", ["PlayerGetsHit.mp3"]);
    game.load.audio("panic", ["LowHP.mp3", "LowHP.ogg"], 1, true);
    game.load.audio("hit", ["EnemyGetsHit.mp3"]);
    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);

    game.load.audio("intro", ["music intro.mp3", "music intro.ogg"]);
    game.load.audio("loop", ["music loop.mp3", "music loop.ogg"]);

  },
	create: function(){

    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious
    var timer = 0;
    frames = 0;  
	this.timer = game.time.create(false);
	this.timer.start();
	timer = (Math.floor(this.timer.seconds))+1;
	// allow blackout background w/ text first

	this.spawning = this.timer.loop(game.rnd.integerInRange(1000,3000), this.spawn, this);


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

    this.player_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("hit")];

    this.player = new PlayerShip(game, this.player_sounds, "player", 0);
    game.add.existing(this.player);
    this.player.inTutorial = true;
	this.asteroids = game.add.group();

	this.health_bar = new HpBar(game, "hp bar", 0, "red", 0, this.player);

	//add tentacle 
	this.tentacle = game.add.sprite(game.width/2, -300, 'tentacle');
	game.physics.enable(this.tentacle, Phaser.Physics.ARCADE);
		this.tentacle.anchor.set(0.5);
		this.tentacle.scale.setTo(2);
		this.tentacle.body.angularVelocity = 300;

	},

	spawn: function(){
	var asteroid;
    var num_asteroids = game.rnd.integerInRange(3, 6); //random number of asteroids
    var asteroid_key;
  	for(let i = 0; i < num_asteroids; i++) {
    
     //switch between the two asteroid assets
     if(i % 2 == 0) asteroid_key = "asteroid2";
     else asteroid_key = "asteroid";
     
     //Enemy(game, x, y, sounds, key, frame)
     asteroid = new Enemy(this.game, this.game.width + Math.random() * 100, Math.random() * this.game.height, this.enemy_sounds, asteroid_key, 0);
     asteroid.can_fire = false; //turn off the ability for asteroids to shoot bullets
     asteroid.body.velocity.x = game.rnd.integerInRange(-200, -100); 
     asteroid.body.velocity.y = game.rnd.integerInRange(-20, 20); //remove velocity from the base Enemy type
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
            enemy.destroy(); 
        }
    },

	update: function(){
		timer = (Math.floor(this.timer.seconds))+1;
		console.log(timer);
		frames++;

	if (this.hp <= 0){
		game.state.start(TutorialPt1);
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
	if (timer == 20 && frames%50 == 0){

		this.playerposx = this.player.body.x;
		this.playerposy = this.player.body.y;
		console.log('posx'+this.playerposx);
		console.log('posy'+this.playerposy);

	}

	if(timer >= 21 ){
		this.player.body.x = this.playerposx;
		this.player.body.y = this.playerposy;
		this.player.body.velocity.x = this.player.body.velocity.y = 0;

		this.tentacle.body.velocity.x = (this.playerposx - game.width/2);
		this.tentacle.body.velocity.y = this.playerposy + 100;

	}

	if(timer >= 23){
		this.health_bar = new HpBar(game, "corrupt bar", 0, "red", 0, this.player);

		if (timer >= 24){
			var warning1 = game.add.text(game.width/2 , game.height/2 + 220,'<- Warning!', {fontSize: "28px", fill:"#FF0000"});
			warning1.anchor.setTo = 0.5;
			warning1.alpha = 0;
			var tween = game.add.tween(warning1).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		}
		if (timer >= 25){
			var warning2 = game.add.text(game.width/2 +100 , 250,'Unknown Threat', {fontSize: "28px", fill:"#FF0000"});
			warning2.anchor.setTo = 0.5;
			warning2.alpha = 0;
			var tween = game.add.tween(warning2).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		}
		if (timer >= 26){
			var warning3 = game.add.text(100, 100,'COORDINATES SET, \nRECALCULATING', {fontSize: "28px", fill:"#FF0000"});
			warning3.anchor.setTo = 0.5;
			warning3.alpha = 0;
			var tween = game.add.tween(warning3).to( {alpha: 1}, 1000, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
		}
		if (timer >= 29){
			game.state.start('TutorialPt2');
		}
	}


	}
};