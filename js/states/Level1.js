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
 //    //preload assets
	// game.load.path = "assets/img/";
 //    game.load.image("background", "bg.png");

 //    // // game.load.image("player", "player ship.png");
 //    // game.load.image("player broken", "player ship broken.png");
 //    // game.load.atlas("player_death", "player_death.png", "player_death.json");
 //    game.load.image("enemy", "enemy.png");
 //    game.load.image("bullet", "bullet.png");
 //    game.load.image("heal", "hpDrop.png");
 //    game.load.image("stars", "Stars.png");
 //    game.load.image("stars2", "Stars2.png");
 //    game.load.image("asteroid", "Asteroid.png");
 //    game.load.image("asteroid2", "Asteroid2.png");
 //    game.load.image("hp bar", "hp bar.png");
 //    game.load.image("red", "hp red.png");

 //    game.load.path = "assets/audio/";
 //    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
 //    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);


 //    game.load.audio("ouch", ["PlayerGetsHit.mp3"]);
 //    game.load.audio("panic", ["LowHP.mp3", "LowHP.ogg"], 1, true);
 //    game.load.audio("hit", ["EnemyGetsHit.mp3"]);
 //    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);
 //    game.load.audio('alarm', ["Alarm.mp3"]);
	},
	create: function(){
    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious  
    frames = 0;
    this.background = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "background");
    this.background.autoScroll(-200, 0);
    game.add.existing(this.background);
    this.stars = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars");
    this.stars.autoScroll(-160, 0);
    this.stars.alpha = 0.9;
    game.add.existing(this.stars);
    this.stars2 = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars2");
    this.stars2.autoScroll(-120, 0);
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
    this.basic_enemies = game.add.group();
    this.asteroid_enemies = game.add.group();

    //put as constant for adjustments
    this.NUM_ENEMIES = 7;

    this.enemies_spawned = 0; //track enemies already spawned
    this.basic_enemies_spawned = 0;
    this.asteroid_enemies_spawned = 0;
    this.all_enemy_bullets = game.add.group(); //keep track of all enemy bullets, for more info see this.transfer below

    this.enemies_killed = 0;
    //group of pickups (for now, just a heal)
    this.pickups = game.add.group();
    this.HEALING = 5; //value of heal pickup

    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux

    this.timer = game.time.create(false);
    this.timer.start(); //don't forget to start timer
    this.health_bar = new HpBar(game, "corrupt bar", 0, "red", 0, this.player);

    this.spawningSineA = this.timer.add(500, this.spawnSineA, this);
    this.spawningSineB = this.timer.add(10000, this.spawnSineB, this);
    this.spawningZagA = this.timer.add(18000, this.spawnZagA, this);
    this.spawningZagB = this.timer.add(25000, this.spawnZagB, this);
    this.spawningZagC = this.timer.add(32000, this.spawnZagC, this);
    this.spawningLshapeA = this.timer.add(38000, this.spawnLshapeA, this);
    this.spawningLshapeB = this.timer.add(45000, this.spawnLshapeB, this);
    //this.spawningStationary = this.timer.add(100, this.spawnStationary, this);
    this.spawningAssault = this.timer.add(100, this.spawnAssault, this);
    this.spawningAsteroidStorm = this.timer.add(100, this.spawnAsteroidStorm, this);


    this.timer.add(55000, this.ending, this);
    this.timer.loop(2000, this.fire, this); 

	},
	update: function(){
	    //restart upon death
    frames++;

  if (this.player.hp <= 0 && this.player.death_anim.isFinished) {
        game.sound.stopAll()﻿;
        game.state.start('GameOver', true, false, false, this.main, this.alt, 'Level1');;
  }    //collision checks
    this.all_enemy_bullets.forEach(this.bullet_collision, this);
    game.physics.arcade.overlap(this.enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.basic_enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.asteroid_enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.crashing, null, this);
    game.physics.arcade.overlap(this.player, this.basic_enemies, this.crashing, null, this);
    game.physics.arcade.overlap(this.player, this.asteroid_enemies, this.crashing, null, this);


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

    // Update Sine A&B waves
    if(this.enemies_spawned <= 10) {
      this.enemies.forEach(this.updateSineA, this);
    }
    if(this.enemies_spawned > 10 && this.enemies_spawned <= 20) {
      this.enemies.forEach(this.updateSineB, this);
    }

    // Update Zag A&B&C Waves
    if (this.enemies_spawned > 20 && this.enemies_spawned <= 25){
      this.enemies.forEach(this.updateZagA, this);
    }
    if (this.enemies_spawned > 25 && this.enemies_spawned <= 30){
      this.enemies.forEach(this.updateZagB, this);
    }
    if (this.enemies_spawned > 30 && this.enemies_spawned <= 40){
      this.enemies.forEach(this.updateZagC, this);
    }
     
    // Update Lshape A&B Waves
    if (this.enemies_spawned > 40 && this.enemies_spawned <= 48){
      this.enemies.forEach(this.updateLshapeA, this);
    }
    if (this.enemies_spawned > 48 && this.enemies_spawned <= 60){
      this.enemies.forEach(this.updateLshapeB, this);
    }
     
    //  Update Stationary and Assault Enemies
    if (this.basic_enemies_spawned > 0 && this.basic_enemies_spawned <= 10){
      this.basic_enemies.forEach(this.updateStationary, this);
    } 
    if (this.basic_enemies_spawned > 10 && this.basic_enemies_spawned <= 20){
          this.basic_enemies.forEach(this.updateAssault, this);
    } 

    // Call upon the wrath of the gods to smite your ship with big space rocks
    if (this.asteroid_enemies_spawned <= 30){
      this.asteroid_enemies.forEach(this.updateAsteroidStorm, this);
    }

    //console.log('Level Timer: '+ this.timer.seconds);
    // if the player survives the level, go to the ending
   // if (this.timer == 50){
   //    this.ending;
   //  }

    this.enemies.forEachDead(this.cleanup, this);


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
    // if(this.enemies.countLiving() > 0) this.enemies.callAll("fire");
    // this.enemies.forEach(this.transfer, this); //transfer all the bullets from the enemy to the state, see below
  },

    //the character, be it player or enemy, takes damage
  damage: function(character, bullet) {
    //because of naming conventions, this should work for both the enemy AND the player
    if(character instanceof Enemy && character.can_fire) {
      this.lastX = character.body.x;
      this.lastY = character.body.y;
      if(bullet.dmg >= character.hp) {
        this.enemies_killed++;
        if (this.enemies_killed % 4 == 0){
          var pickup = new Pickup(game, this.lastX, this.lastY, "heal", 0);
          this.pickups.add(pickup);
        }
        this.timer.remove(character.firing);
        this.timer.remove(character.bullet_transfer);
      }
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
      this.timer.remove(enemy.firing);
      this.timer.remove(enemy.bullet_transfer);
      enemy.hp = 0; //destroy non-boss enemies upon crashing
    }
  },

  //because once an enemy is killed, its bullets property becomes unreachable, transfer all bullets
  //shot from all enemies into a group owned by the state itself so they can actually work
  transfer: function(enemy) {
    this.all_enemy_bullets.addMultiple(enemy.bullets);
  },
  
  cleanup: function(enemy) {
    this.timer.remove(enemy.firing);
    this.timer.remove(enemy.bullet_transfer);
    enemy.bullets.destroy();
    enemy.destroy();
  },


  //to save a slight amount of processing power, only checks overlap for those bullets within a certain band of x-values
  //of the player.  this means that some bullets are checked twice (in the band + overlap) but others will only be
  //partially checked (in the band - only checks x-value, not y-value).  at least i think this is better.
  bullet_collision: function(bullet){
    if(bullet.x > this.player.body.x-64 && bullet.x < this.player.body.x + 64) game.physics.arcade.overlap(this.player, bullet, this.damage);
  },
  spawn: function(x, y, key, frame) {
    //spawns a series of enemies that goes in a sine wave towards the player
      console.log('spawning enemy');
      var enemy = new Enemy(game, x, y, this.enemy_sounds, key, frame, false);
      this.enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.x = -150;
      var enemyfirerate = game.rnd.integerInRange(500,1500);
      enemy.firing = this.timer.loop(enemyfirerate, enemy.fire, enemy);
      enemy.bullet_transfer = this.timer.loop(enemyfirerate, this.transfer, this, enemy);

        console.log('enemy.body.y: '+ enemy.body.y);
  },
  basicSpawn: function(x, y, key, frame) {
    //spawns a series of enemies that goes in a sine wave towards the player
      console.log('spawning enemy');
      var enemy = new Enemy(game, x, y, this.enemy_sounds, key, frame, false);
      this.basic_enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.x = -150;
      var enemyfirerate = game.rnd.integerInRange(1000,1500);
      enemy.firing = this.timer.loop(enemyfirerate, enemy.fire, enemy);
      enemy.bullet_transfer = this.timer.loop(enemyfirerate, this.transfer, this, enemy);
        console.log('enemy.body.y: '+ enemy.body.y);
  },
  asteroidSpawn: function(x, y, key, frame){
    // spawns asteroid storms
      console.log('spawning asteroid');
      var enemy = new Enemy(game, x, y, this.enemy_sounds, key, frame, false);
      this.asteroid_enemies.add(enemy);
      enemy.can_fire = false;
      enemy.body.velocity.x = -200;
      enemy.body.angularVelocity = 300;

  },

	spawnSineA: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
      if (this.enemies_spawned < 10){
        this.spawn(game.width, game.height/2, "enemy", "sine");
        this.enemies_spawned++;
       } else this.timer.remove(this.loop); 
      }, this);
    console.log(this.loop);
	},
//updates the enemies going in a single sine pattern
  updateSineA: function(enemy) {
    if(enemy.body != null) {
      //set the velocity going upwards on spawn
      if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.y = -200;
      //if the enemy is above the 1/4 line, go down
      if (enemy.body.y < game.height/8){
          enemy.body.velocity.y = 200;
      }
      //if the enemy is below the 3/4 line, go up
      if (enemy.body.y > game.height*0.875){
          enemy.body.velocity.y = -200;
      }
      }
  },

	    //spawns a series of enemies that goes in two alternating sine waves towards the player
	spawnSineB: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 20) {
        this.spawn(game.width, game.height/4, "enemy", "sine");
        this.spawn(game.width, game.height*0.75, "enemy", "sine");
        this.enemies_spawned++;
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);

	},

  updateSineB: function(enemy){    
        if(enemy.body != null) {
    if(this.enemies.getIndex(enemy) % 2 == 0) {
      if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.y = -300;
      //if the enemy is above the 1/8 line, go down
      if (enemy.body.y < game.height*0.125 - 50){
          enemy.body.velocity.y = 300;
      }
      //if the enemy is below the 3/8 line, go up
      if (enemy.body.y > game.height*0.375 + 50){
          enemy.body.velocity.y = -300;
      }
    } 
    else {
      if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.y = 300;
      //if the enemy is above the 5/8 line, go down
      if (enemy.body.y < game.height*0.625 - 50){
          enemy.body.velocity.y = 300;
      }
      //if the enemy is below the 7/8 line, go up
      if (enemy.body.y > game.height*0.875 + 50){
          enemy.body.velocity.y = -300;
      }
    }
  }

  },

	    //spawns a series of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then zags away
	spawnZagA: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 25) {
        this.spawn(game.width, game.height/4, "enemy", "diagonal");
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateZagA: function(enemy){    
        if(enemy.body != null) {

      //set the velocity going upwards on spawn
      //if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.y = -300;
      //if the enemy is above the 1/4 line, go down
      if (enemy.body.x < game.width/5){
          enemy.body.velocity.y = 200;
          enemy.body.velocity.x = 150;
      }
    }
  },

	    //spawns a series of two sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then zags away
	spawnZagB: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 30) {
        this.spawn(game.width, game.height*0.75, "enemy", "diagonal");
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateZagB: function(enemy){    
        if(enemy.body != null) {

       //set the velocity going upwards on spawn
      //if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -300;
      //if the enemy is above the 1/4 line, go down
      if (enemy.body.x < game.width/5){
          enemy.body.velocity.y = -200;
          enemy.body.velocity.x = 150;
      }
    }
  },
    spawnZagC: function() {
    //Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 40) {
        this.spawn(game.width, game.height*0.75, "enemy", "diagonal");
        this.spawn(game.width, game.height/4, "enemy", "diagonal");
        this.enemies_spawned++;
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
  },

    updateZagC: function(enemy){    
          if(enemy.body != null) {

       //set the velocity going upwards on spawn
      //if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -300;
      if(this.enemies.getIndex(enemy) % 2 == 0) {
            if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -300;

        if (enemy.body.x < game.width/5){
            enemy.body.velocity.y = -200;
            enemy.body.velocity.x = 150;
        }
      } else {
            if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -300;

        if (enemy.body.x < game.width/5){
            enemy.body.velocity.y = 200;
            enemy.body.velocity.x = 150;
        }
      }
    }
  },

	    //spawns a series of two sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then go up or down offscreen away
	spawnLshapeA: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 48) {
        this.spawn(game.width, game.height/2, "enemy", "diagonal");
        this.spawn(game.width, game.height/2, "enemy", "diagonal");
        this.enemies_spawned++;
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateLshapeA: function(enemy){
        if(enemy.body != null) {

      if(this.enemies.getIndex(enemy) % 2 == 0) {
            if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -300;

        if (enemy.body.x < game.width/2){
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = -200;
            //enemy.body.velocity.x = 200;
        }
      } else {
            if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -300;

        if (enemy.body.x < game.width/2){
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 200;
            //enemy.body.velocity.x = 200;
        }
      }
    }
  },
	    //spawns a series of three sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then go up or down offscreen away
	spawnLshapeB: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 60) {
        this.spawn(game.width, game.height/3, "enemy", "diagonal");
        this.spawn(game.width, game.height/2, "enemy", "diagonal");
        this.spawn(game.width, 2*game.height/3, "enemy", "diagonal");
        this.enemies_spawned++;
        this.enemies_spawned++;
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateLshapeB: function(enemy){
        if(enemy.body != null) {

      if(this.enemies.getIndex(enemy) % 2 == 0 && this.enemies.getIndex(enemy) % 3 != 0) {
            if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -400;

        if (enemy.body.x < game.width/2){
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = -200;
            //enemy.body.velocity.x = 200;
        }
      } else if (this.enemies.getIndex(enemy) % 3 == 0 && this.enemies.getIndex(enemy) % 2 != 0){
            if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -400;

        if (enemy.body.x < game.width/2){
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 200;
            //enemy.body.velocity.x = 200;
        }
      } else {     
        if (enemy.body.x < game.width/2){
            enemy.body.velocity.x = -250;
            enemy.body.velocity.y = 0;
            //enemy.body.velocity.x = 200;
        }
      }
    }
  },
	    //spawns a set of enemies that go towards the player and then stay and fire
	spawnStationary: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(3000, function() {
    if(this.basic_enemies_spawned < 10) {
        this.basicSpawn(game.width, game.rnd.integerInRange(0,600), "enemy", "stationary");
        this.basic_enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateStationary: function(enemy){
        if(enemy.body != null) {

      //set the velocity going upwards on spawn
      if(enemy.body.x >= 15/16 * game.width) enemy.body.velocity.x = -150;
      //if the enemy is above the 1/4 line, go down
      if (enemy.body.x < game.rnd.integerInRange(0,600)){
          enemy.body.velocity.y = 0;
          enemy.body.velocity.x = 0;
      }
    }

  },

	//spawns a set of enemies that go towards the player and fire then continue offscreen
	spawnAssault: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(2000, function() {
    if(this.basic_enemies_spawned < 20) {
        this.basicSpawn(game.width, game.rnd.integerInRange(0,600), "enemy", "assault");
        this.basic_enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateAssault: function(enemy){
        if(enemy.body != null) {

      //set the velocity going left on spawn
      if(enemy.body.x >= 15/16 * game.width) {
        enemy.body.velocity.y = 0;
        enemy.body.velocity.x = -500;
      }
    }
  },

	    //spawns a set of random asteriods like that fall from top right to bottom left
	spawnAsteroidStorm: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(5000, function() {
    if(this.asteroid_enemies_spawned < 30) {
        this.asteroidSpawn(game.rnd.integerInRange(100,900), 0, "enemy", "asteroid");
        this.asteroid_enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

  updateAsteroidStorm: function(enemy){
        if(enemy.body != null) {

    if(enemy.body.x <= 15/16 * game.width) {
      enemy.body.velocity.y = game.rnd.integerInRange(100, 600);
      enemy.body.velocity.x = game.rnd.integerInRange(-100, -600);
    }
  }
  },

  //when a player reaches the end of the tutorial, allow the player to move again and prepare to advance to the next level
  ending: function() {
    game.add.text(game.width/8, 170,"LEVEL CLEARED",{fontSize: "32px", fill:"#FFFF00"});
    game.add.text(game.width/8, 250,"ENTERING VOID. PLEASE PREPARE",{fontSize: "32px", fill:"#00FFFF"});
    this.timer.add(7000, game.state.start, game.state, "BossLevel", true, false, this.main, this.alt);
  }


};