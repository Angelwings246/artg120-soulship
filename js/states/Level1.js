// Level 1 (Main Level)
'use strict';
var timer;
var frames;

var Level1 = function(game) {};

Level1.prototype = {
	init: function(main, alt, music_vol, sfx_vol) {
		this.main = main;
		this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
    console.log(this.music_vol, this.sfx_vol);

	},
	preload: function(){
 //all preloading done in Load state
	},
	create: function(){
    game.sound.stopAll()﻿;
    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious  
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

    this.player = new PlayerShip(game, this.player_sounds, "player", "player ship broken", this.main, this.alt, this.sfx_vol);
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
    this.health_bar = new HpBar(game, "hp bar", "hp bar01", "red", 0, this.player);
    this.health_bar.outer.animations.play("idle");

    this.init_patterns();

    this.spawningSineA = this.timer.add(500, this.spawnSineA, this);
    this.spawningSineB = this.timer.add(14000, this.spawnSineB, this);
    this.spawningZagA = this.timer.add(20000, this.spawnZagA, this);
    this.spawningZagB = this.timer.add(27000, this.spawnZagB, this);
    this.spawningZagC = this.timer.add(35000, this.spawnZagC, this);
    this.spawningLshapeA = this.timer.add(45000, this.spawnLshapeA, this);
    this.spawningLshapeB = this.timer.add(53000, this.spawnLshapeB, this);
    //this.spawningStationary = this.timer.add(100, this.spawnStationary, this);
    this.spawningAssault = this.timer.add(100, this.spawnAssault, this);
    this.spawningAsteroidStorm = this.timer.add(100, this.spawnAsteroidStorm, this);


    this.timer.add(63000, this.ending, this);
    // this.timer.loop(2000, this.fire, this); 

	},
	update: function(){

  if (this.player.hp <= 0 && this.player.death_anim.isFinished) {
        game.sound.stopAll()﻿;
        game.state.start('GameOver', true, false, false, this.main, this.alt, this.music_vol, this.sfx_vol, 'Level1');;
  }    //collision checks
    this.all_enemy_bullets.forEach(this.bullet_collision, this);
    game.physics.arcade.overlap(this.enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.basic_enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.asteroid_enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.crashing, null, this);
    game.physics.arcade.overlap(this.player, this.basic_enemies, this.crashing, null, this);
    game.physics.arcade.overlap(this.player, this.asteroid_enemies, this.crashing, null, this);

            //debug cred: Nathan Altice inputs08.js
    if(game.input.keyboard.addKey(Phaser.KeyCode.T).justPressed()) {
      this.debug = !this.debug;
    }
    // cheat to get to ending quickly
    if(game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()) this.ending();

    //Update Stationary and Assault Enemies
    if (this.basic_enemies_spawned > 0 && this.basic_enemies_spawned <= 15){
      this.basic_enemies.forEach(this.updateStationary, this);
    } 
    if (this.basic_enemies_spawned > 15 && this.basic_enemies_spawned <= 30){
          this.basic_enemies.forEach(this.updateAssault, this);
    } 

    // Call upon the wrath of the gods to smite your ship with big space rocks
    if (this.asteroid_enemies_spawned <= 30){
      this.asteroid_enemies.forEach(this.updateAsteroidStorm, this);
    }

    //cleanup enemies that die from going offscreen
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
    //the character, be it player or enemy, takes damage
  damage: function(character, bullet) {
    //because of naming conventions, this should work for both the enemy AND the player
    if(character instanceof Enemy && character.can_fire) {
      //track the position of an enemy when it gets shot
      this.lastX = character.body.x;
      this.lastY = character.body.y;
      //if that enemy dies, increment number of kills
      if(bullet.dmg >= character.hp) {
        this.enemies_killed++;
        //spawn a health pack every 5th kill
        if (this.enemies_killed % 5 == 0){
          var pickup = new Pickup(game, this.lastX, this.lastY, "heal", 0);
          this.pickups.add(pickup);
        }
        //remove the timers that determine the enemy's firing 
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
    if(player.hp > 0) {
      this.player.time_since_heal = 0;
      player.hp += this.HEALING;
      if(player.hp > player.PLAYER_MAX_HP) player.hp = player.PLAYER_MAX_HP; //don't let the player overflow on health
      this.heal_sound.play("", 0, this.sfx_vol);
      pickup.destroy();
    }
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
  //destroy the enemies that have gone offscreen
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
  spawn: function(x, y, key, frame, path) {
    //spawns a series of enemies that goes in a sine wave towards the player
      console.log('spawning enemy');
      var enemy = new Enemy(game, x, y, this.enemy_sounds, key, frame, this.sfx_vol, false);
      this.enemies.add(enemy);
      enemy.path = path;
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.x = -150;
      var enemyfirerate = game.rnd.integerInRange(500,1500);
      enemy.firing = this.timer.loop(enemyfirerate, enemy.fire, enemy);
      enemy.bullet_transfer = this.timer.loop(enemyfirerate, this.transfer, this, enemy);

        // console.log('enemy.body.y: '+ enemy.body.y);
  },
  basicSpawn: function(x, y, key, frame) {
    //spawns a series of enemies that goes in a sine wave towards the player
      console.log('spawning enemy');
      var enemy = new Enemy(game, x, y, this.enemy_sounds, key, frame, this.sfx_vol, false);
      this.basic_enemies.add(enemy);
      enemy.rotation = Math.PI;
      enemy.can_fire = true;
      enemy.body.velocity.x = -150;
      var enemyfirerate = game.rnd.integerInRange(1000,1500);
      enemy.firing = this.timer.loop(enemyfirerate, enemy.fire, enemy);
      enemy.bullet_transfer = this.timer.loop(enemyfirerate, this.transfer, this, enemy);
        // console.log('enemy.body.y: '+ enemy.body.y);
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
        this.spawn(game.width, game.height/2, "enemy", "sine", this.sineApattern);
        this.enemies_spawned++;
       } else this.timer.remove(this.loop); 
      }, this);
    console.log(this.loop);
	},

	    //spawns a series of enemies that goes in two alternating sine waves towards the player
	spawnSineB: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 20) {
        this.spawn(game.width, game.height/4, "enemy", "sine", this.sineBpattern1);
        this.spawn(game.width, 3*game.height/4, "enemy", "sine",this.sineBpattern2);
        this.enemies_spawned++;
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);

	},

	    //spawns a series of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then zags away
	spawnZagA: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 25) {
        this.spawn(game.width, game.height/4, "enemy", "diagonal", this.zagApattern);
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

	    //spawns a series of two sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then zags away
	spawnZagB: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 30) {
        this.spawn(game.width, 3*game.height/4, "enemy", "diagonal", this.zagBpattern);
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

    spawnZagC: function() {
    //Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 40) {
        this.spawn(game.width, game.height/4, "enemy", "diagonal", this.zagApattern);
        this.spawn(game.width, 3*game.height/4, "enemy", "diagonal", this.zagBpattern);
        this.enemies_spawned++;
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
  },

	    //spawns a series of two sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then go up or down offscreen away
	spawnLshapeA: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 48) {
        if(this.enemies_spawned % 2 == 0) this.spawn(game.width, game.height/2, "enemy", "diagonal", this.LshapeApattern);
        else this.spawn(game.width, game.height/2, "enemy", "diagonal", this.LshapeBpattern);
        this.enemies_spawned++;
    }else this.timer.remove(this.loop);
  }, this);
	},

	    //spawns a series of three sets of enemies that goes straight towards the player (about game.world.centerX and then game.world.centerX +- 250 then go up or down offscreen away
	spawnLshapeB: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(400, function() {
    if(this.enemies_spawned < 60) {
        this.spawn(game.width, game.height/3, "enemy", "diagonal", this.LshapeCpattern);
        this.spawn(game.width, game.height/2, "enemy", "diagonal", null);
        this.spawn(game.width, 2*game.height/3, "enemy", "diagonal", this.LshapeDpattern);
        this.enemies_spawned += 3;
    }else this.timer.remove(this.loop);
  }, this);
	},

	    //spawns a set of enemies that go towards the player and then stay and fire
	spawnStationary: function() {
		//Enemy(game, x, y, sounds, key, frame)
    this.loop = this.timer.loop(3000, function() {
    if(this.basic_enemies_spawned < 15) {
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
    if(this.basic_enemies_spawned < 30) {
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

    game.add.bitmapText(game.width/8, 170, 'aldrich64', "LEVEL CLEARED", 32);
    game.add.bitmapText(game.width/8, 250, 'aldrich64', "ENTERING VOID. PLEASE PREPARE",32);
    this.timer.add(7000, game.state.start, game.state, "BossLevel", true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
  },
    //set up all the movement patterns, kept outside create for organization 
  init_patterns: function(){

    /* Sine wave pattern 
    * Each "point" after start refers to essentially every PI/2, so vertices and intercepts:
    * With num_points = 6, it looks like:

               *
      \      /   \
       *    *     *
        \  /
         *
    SINE A: one large pattern in the center
    SINE B: two small patterns, one on top and on on bottom
    */

    //temp vars to calculate everything
    var num_points = 8;
    var vy_max = 200;
    var vy = -vy_max;

    //calculate the x velocity using the number of desired points and the set y velocity.
    var vx = -(vy_max * game.width/num_points)/ (3/8 * game.height);

    //one large pattern as diagrammed above
    this.sineApattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };

    //filling up the pattern:
    for(let i = 0; i < num_points; i++) {
      var px = game.width - i* game.width/num_points; //x: divide equally, since vx is constant
      var py;
      if(i%2 == 1) vy*= -1; //every OTHER point, flip vy, this allows for the straight section

      if(i%2 == 0) py = game.height/2; //every OTHER point is on the center line
      else if(i%4 == 1) py = 1*game.height/8; //if it's not on the center, it alternates above and below
      else py = 7*game.height/8;

      //push the corresponding value onto each array
      this.sineApattern.points.x.push(px);
      this.sineApattern.points.y.push(py);
      this.sineApattern.vels.x.push(vx);
      this.sineApattern.vels.y.push(vy);
    }

    // console.log(this.sineApattern);
    this.tester = new Enemy(game, game.width + 50, game.height/2, this.enemy_sounds, "enemy", "sine", false);
    this.tester.body.velocity.x = vx;
    this.tester.path = this.sineApattern;
    // this.enemies.add(this.tester);

    //small pattern as diagrammed above, top half
    this.sineBpattern1 = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };

    vy = -vy_max;
    vx = -(vy_max * game.width/num_points)/ (3/16 * game.height);
    for(let i = 0; i < num_points; i++) {
      var px = game.width - i* game.width/num_points; //x: divide equally, since vx is constant
      var py;
      if(i%2 == 1) vy*= -1; //every OTHER point, flip vy, this allows for the straight section

      if(i%2 == 0) py = game.height/4; //every OTHER point is on the center line
      else if(i%4 == 1) py = 1*game.height/16; //if it's not on the center, it alternates above and below
      else py = 7*game.height/16;

      //push the corresponding value onto each array
      this.sineBpattern1.points.x.push(px);
      this.sineBpattern1.points.y.push(py);
      this.sineBpattern1.vels.x.push(vx);
      this.sineBpattern1.vels.y.push(vy);
    }

    //small pattern as diagrammed above, bottom half
    this.sineBpattern2 = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    vy = vy_max;
    vx = -(vy_max * game.width/num_points)/ (3/16 * game.height);
    for(let i = 0; i < num_points; i++) {
      var px = game.width - i* game.width/num_points; //x: divide equally, since vx is constant
      var py;
      if(i%2 == 1) vy*= -1; //every OTHER point, flip vy, this allows for the straight section

      if(i%2 == 0) py = 3*game.height/4; //every OTHER point is on the center line
      else if(i%4 == 3) py = 9*game.height/16; //if it's not on the center, it alternates above and below
      else py = 15*game.height/16;

      //push the corresponding value onto each array
      this.sineBpattern2.points.x.push(px);
      this.sineBpattern2.points.y.push(py);
      this.sineBpattern2.vels.x.push(vx);
      this.sineBpattern2.vels.y.push(vy);
    }

    /*Zag pattern.  Not zigzag, just the zag part. (Also, math gets easier from here)
    * The "point" after start refers to the vertex at which the direction of travel changes:
    * 
    *  *-----------
    *   \
    *    \
    *     
    * ZAG A: spawns on the top, then travels down
    * ZAG B: spawns on the bottom, then travels up 
    */

    //pattern diagrammed above, starts at top
    this.zagApattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    //first point
    this.zagApattern.points.x.push(game.width);
    this.zagApattern.points.y.push(game.height/4);
    this.zagApattern.vels.x.push(-150);
    this.zagApattern.vels.y.push(0);
    //second point
    this.zagApattern.points.x.push(game.width/5);
    this.zagApattern.points.y.push(game.height/4);
    this.zagApattern.vels.x.push(150);
    this.zagApattern.vels.y.push(200);

    //pattern diagrammed above, starts at bottom
    this.zagBpattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    //first point
    this.zagBpattern.points.x.push(game.width);
    this.zagBpattern.points.y.push(3*game.height/4);
    this.zagBpattern.vels.x.push(-150);
    this.zagBpattern.vels.y.push(0);
    //second point
    this.zagBpattern.points.x.push(game.width/5);
    this.zagBpattern.points.y.push(3*game.height/4);
    this.zagBpattern.vels.x.push(150);
    this.zagBpattern.vels.y.push(-200);

    /* Lshape pattern, similar to Zag but goes perpendicularly
    *  
    *  |
    *  |
    *  *------------
    *
    * LshapeA: goes from center then goes up
    * LshapeB: goes from center then goes down
    * LshapeC: goes from slightly above center then goes up
    * LshapeD: goes from slightly below center then goes down
    */

    //center then up
    this.LshapeApattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    //first point
    this.LshapeApattern.points.x.push(game.width);
    this.LshapeApattern.points.y.push(game.height/2);
    this.LshapeApattern.vels.x.push(-150);
    this.LshapeApattern.vels.y.push(0);
    //second point
    this.LshapeApattern.points.x.push(game.width/2);
    this.LshapeApattern.points.y.push(game.height/2);
    this.LshapeApattern.vels.x.push(0);
    this.LshapeApattern.vels.y.push(-200);

    //center then down
    this.LshapeBpattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    //first point
    this.LshapeBpattern.points.x.push(game.width);
    this.LshapeBpattern.points.y.push(game.height/2);
    this.LshapeBpattern.vels.x.push(-150);
    this.LshapeBpattern.vels.y.push(0);
    //second point
    this.LshapeBpattern.points.x.push(game.width/2);
    this.LshapeBpattern.points.y.push(game.height/2);
    this.LshapeBpattern.vels.x.push(0);
    this.LshapeBpattern.vels.y.push(200);

    //above center then up
    this.LshapeCpattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    //first point
    this.LshapeCpattern.points.x.push(game.width);
    this.LshapeCpattern.points.y.push(game.height/3);
    this.LshapeCpattern.vels.x.push(-150);
    this.LshapeCpattern.vels.y.push(0);
    //second point
    this.LshapeCpattern.points.x.push(game.width/2);
    this.LshapeCpattern.points.y.push(game.height/3);
    this.LshapeCpattern.vels.x.push(0);
    this.LshapeCpattern.vels.y.push(-200);

    //below center then down
    this.LshapeDpattern = {
      points: {
        x: [],
        y: []
      },
      vels: {
        x: [],
        y: []
      }
    };
    //first point
    this.LshapeDpattern.points.x.push(game.width);
    this.LshapeDpattern.points.y.push(2*game.height/3);
    this.LshapeDpattern.vels.x.push(-150);
    this.LshapeDpattern.vels.y.push(0);
    //second point
    this.LshapeDpattern.points.x.push(game.width/2);
    this.LshapeDpattern.points.y.push(2*game.height/3);
    this.LshapeDpattern.vels.x.push(0);
    this.LshapeDpattern.vels.y.push(200);
  }, 
};