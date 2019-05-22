// Level 1 (Main Level)
'use strict';
var timer;
var frames;

var Level1 = function(game) {};

Level1.prototype = {
	init: function(main, alt) {
		this.main = main;
		this.alt = alt;

	},
	preload: function(){
    //preload assets
	game.load.path = "assets/img/";
    game.load.image("background", "bg.png");

    // // game.load.image("player", "player ship.png");
    // game.load.image("player broken", "player ship broken.png");
    // game.load.atlas("player_death", "player_death.png", "player_death.json");
    game.load.image("enemy", "enemy.png");
    game.load.image("bullet", "bullet.png");
    game.load.image("heal", "hpDrop.png");
    game.load.image("stars", "Stars.png");
    game.load.image("stars2", "Stars2.png");
    game.load.image("asteroid", "Asteroid.png");
    game.load.image("asteroid2", "Asteroid2.png");
    game.load.image("hp bar", "hp bar.png");
    game.load.image("red", "hp red.png");

    game.load.path = "assets/audio/";
    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);


    game.load.audio("ouch", ["PlayerGetsHit.mp3"]);
    game.load.audio("panic", ["LowHP.mp3", "LowHP.ogg"], 1, true);
    game.load.audio("hit", ["EnemyGetsHit.mp3"]);
    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);
    game.load.audio('alarm', ["Alarm.mp3"]);
	},
	create: function(){
    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious  
    frames = 0;
    this.background = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "background");
    this.background.autoScroll(-11, 0);
    game.add.existing(this.background);
    this.stars = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars");
    this.stars.autoScroll(-9, 0);
    this.stars.alpha = 0.9;
    game.add.existing(this.stars);
    this.stars2 = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars2");
    this.stars2.autoScroll(-7, 0);
    game.add.existing(this.stars2);
    this.stars2.alpha = 0.4;

    // set up music
    // this.intro = game.add.audio("intro");
    // this.intro.play();
    // this.music = game.add.audio("loop", 1, true);

    //set up sounds
    this.heal_sound = game.add.audio("heal");
    this.alarm_sound = game.add.audio("alarm");
    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("hit")];

    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit, Low HP
    this.player_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];

    //PlayerShip(game, sounds, key, frame)  

    this.player = new PlayerShip(game, this.player_sounds, "player", "player ship broken", this.main, this.alt);
    game.add.existing(this.player);
    this.player.body.x = this.startX = game.width/4;
    this.player.body.y = this.startY = game.height/2;

    //add the group of enemies and a counter for enemies spawned
    this.enemies = game.add.group();

    //put as constant for adjustments
    this.NUM_ENEMIES = 7;

    this.enemies_spawned = 0; //track enemies already spawned
    this.all_enemy_bullets = game.add.group(); //keep track of all enemy bullets, for more info see this.transfer below

    //group of pickups (for now, just a heal)
    this.pickups = game.add.group();
    this.HEALING = 5; //value of heal pickup

    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux

    this.timer = game.time.create(false);
    this.timer.start(); //don't forget to start timer
    this.health_bar = new HpBar(game, "hp bar", 0, "red", 0, this.player);

    this.spawningSineAFirst = this.timer.loop(400, this.spawnSineA, this);
      console.log('calling enemy loop 1');

    this.spawningSineASecond = this.timer.loop(800, this.spawnSineA, this); 
      console.log('calling enemy loop 2');

    this.timer.loop(2000, this.fire, this); 


    //this.timer.add(10000, this.spawnSineB, this);
    //this.timer.add(1300, this.spawnZagA, this);
    //this.timer.add(17500, this.spawnZagA, this);
    //this.timer.add(20000, this.spawnZagB, this);
    //this.timer.add(25000, this.spawnLshapeA, this);
    //this.timer.add(30000, this.spawnLshapeB, this);
    //this.timer.loop(5000, this.spawnStationary, this);
    //this.timer.loop(10000, this.spawnAssault, this);
    //this.timer.add(game.rnd.integerInRange(10000,40000), this.spawnAsteroidRandom, this);
    //this.timer.add(game.rnd.integerInRange(40000,80000), this.spawnAsteroidStorm, this);
    //this.timer.add(game.rnd.integerInRange(80000,100000), this.spawnAsteroidLarge, this);
	},
	update: function(){
	    //restart upon death
    frames++;
    if(this.player.hp <= 0 && this.player.death_anim.isFinished) game.state.start('Level1', true, false, this.main, this.alt);
    //collision checks
    this.all_enemy_bullets.forEach(this.bullet_collision, this);
    game.physics.arcade.overlap(this.enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.crashing, null, this);

        // flash warning every time player shoots 
    if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() || game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).isDown && this.player.time_since_last_shot % this.player.FIRE_RATE == 0) {
      this.shots_fired++;
    }
            //debug cred: Nathan Altice inputs08.js
    if(game.input.keyboard.addKey(Phaser.KeyCode.T).justPressed()) {
      this.debug = !this.debug;
    }
    // cheat to get to ending quickly
    if(game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()) this.ending();


 

    if (this.timer <= 4){
      if (this.spawningSineAFirst != null){
        this.timer.remove(this.spawningSineAFirst);
        console.log('ending enemy loop 1');
      }
    }
    if (this.timer <= 10){
      if (this.spawningSineASecond != null){
        this.timer.remove(this.spawningSineASecond);
        console.log('ending enemy loop 2');
      }    
    } 

    //console.log('Level Timer: '+ this.timer.seconds);
    // if the player survives the level, go to the ending
   if (this.timer == 180){
      this.ending;
    }



	},
   render: function() {
    if(this.debug) {
      //turn on all debug bodies
      game.debug.body(this.player);
      this.enemies.forEach(game.debug.body, game.debug);
      // this.boss.bullets.forEach(game.debug.body, game.debug);
      this.player.bullets.forEach(game.debug.body, game.debug);
      game.debug.text(this.timer.seconds, 50, 50);
    }
  },

  //triggers all the enemies to fire
  fire: function() {
    if(this.enemies.countLiving() > 0) this.enemies.callAll("fire");
    this.enemies.forEach(this.transfer, this); //transfer all the bullets from the enemy to the state, see below
  },

    //the character, be it player or enemy, takes damage
  damage: function(character, bullet) {
    //because of naming conventions, this should work for both the enemy AND the player
    if(character instanceof Enemy && this.enemies_spawned >= this.NUM_ENEMIES && this.enemies.countLiving() == 1) {
      this.lastX = character.body.x;
      this.lastY = character.body.y;
    }
    if(character.body != null) {
      character.damage(bullet.dmg);
      bullet.destroy(); //destroy instead of kill to free memory
    }
  },

  //called when the player picks up a health pack
  heal: function(player, pickup) {
    player.hp += this.HEALING;
    if(player.hp > player.PLAYER_MAX_HP) player.hp = player.PLAYER_MAX_HP; //don't let the player overflow on health
    this.heal_sound.play();
    pickup.destroy();
    if(this.ready) this.ending();
  },

  //called when the player crashes into an enemy_sounds
  crashing: function(player, enemy) {
    if(enemy.body != null) {
      player.damage(3); //arbitrary number for now
      enemy.destroy(); //destroy non-boss enemies upon crashing
    }
  },

  //because once an enemy is killed, its bullets property becomes unreachable, transfer all bullets
  //shot from all enemies into a group owned by the state itself so they can actually work
  transfer: function(enemy) {
    this.all_enemy_bullets.addMultiple(enemy.bullets);
  },
  //to save a slight amount of processing power, only checks overlap for those bullets within a certain band of x-values
  //of the player.  this means that some bullets are checked twice (in the band + overlap) but others will only be
  //partially checked (in the band - only checks x-value, not y-value).  at least i think this is better.
  bullet_collision: function(bullet){
    if(bullet.x > this.player.body.x-64 && bullet.x < this.player.body.x + 64) game.physics.arcade.overlap(this.player, bullet, this.damage);
  },

    //spawns a series of enemies that goes in a sine wave towards the player
	spawnSineA: function() {
		//Enemy(game, x, y, sounds, key, frame)
    if (this.timer.seconds < 4){
      console.log('spawning enemy');
      var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
      this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.x = -200;
        console.log('enemy.body.y: '+ enemy.body.y);

      if (enemy.body.y > game.height/4){
          enemy.body.velocity.y = -200;
          if (enemy.body.y > game.height*0.75){
            enemy.body.velocity.y = 200;
          }
      }
      this.enemies_spawned++;
    }
	},


	    //spawns a series of enemies that goes in two alternating sine waves towards the player
	spawnSineB: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	    //spawns a series of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then zags away
	spawnZagA: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	    //spawns a series of two sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then zags away
	spawnZagB: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	    //spawns a series of two sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then go up or down offscreen away
	spawnLshapeA: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},
	    //spawns a series of three sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then go up or down offscreen away
	spawnLshapeB: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},
	    //spawns a set of enemies that go towards the player and then stay and fire
	spawnStationary: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	//spawns a set of enemies that go towards the player and fire then continue offscreen
	spawnAssault: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	    //spawns a set of random asteriods like the asteroid belt 
	spawnAsteroidRandom: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	    //spawns a set of random asteriods like that fall from top right to bottom left
	spawnAsteroidStorm: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},

	    //spawns one lorg asteroid that comes straight at the player
	spawnAsteroidLarge: function() {
		//Enemy(game, x, y, sounds, key, frame)

    if(this.enemies_spawned < this.NUM_ENEMIES) {
  		var enemy = new Enemy(game, game.width, game.height/2, this.enemy_sounds, "enemy", 0, false);
  		this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.y = 0;
      enemy.body.velocity.x = -100;
  		this.enemies_spawned++;
    }
	},
  //when a player reaches the end of the tutorial, allow the player to move again and prepare to advance to the next level
  ending: function() {
    game.add.text(game.width/8, 170,"LEVEL CLEARED",{fontSize: "32px", fill:"#FFFF00"});
    game.add.text(game.width/8, 250,"ENTERING VOID. PLEASE PREPARE",{fontSize: "32px", fill:"#00FFFF"});
    this.timer.add(7000, game.state.start, game.state, "BossLevel", true, false, this.main, this.alt);
  }


};