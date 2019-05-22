// Tutorial Part 2 Level State
'use strict';
var timer;
var TutorialPt2 = function(game) {};

TutorialPt2.prototype = {  
  init: function(main, alt) {
    this.main = main;
    this.alt = alt;
  },
	preload: function() {
   //all preloading done in Load state
  },
	create: function(){
    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious  
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

    // //set up music
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
    this.timer.loop(2000, this.spawn, this); 
    this.timer.loop(5000, this.fire, this); 
    this.timer.start(); //don't forget to start timer


    this.warning_text = game.add.text(game.width/8, 100,"!--WARNING: ENGINES DAMAGED--!\n!--WARNING: HULL UNSTABLE--!",{fontSize: "32px", fill:"#FF0000"});

    //player's hp bar is from a prefab
    this.health_bar = new HpBar(game, "corrupt bar", 0, "red", 0, this.player);

    this.movement = false; //flag to lock player movement

    this.shots_fired = 0; //count the number of times the player has shot
    this.ready = false; //swap to true when the player is deemed ready to move on

    //store the location of the final enemy when it dies
    this.lastX = game.width;
    this.lastY = game.height/2;
	},
	update: function(){

		//lock player movement
		if(!this.movement) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.body.x = this.startX;
      this.player.body.y = this.startY;
    }

    //the player is ready to continue once all enemies are spawned and destroyed
    if(this.enemies_spawned >= this.NUM_ENEMIES && this.enemies.countLiving() == 0 && !this.ready) {
      this.ready = true;
        //spawn a health pack so the ending can be triggered
        var pickup = new Pickup(game, this.lastX, this.lastY, "heal", 0);
        this.pickups.add(pickup);
      
    }
    // flash warning every time player shoots 
    if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() || game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).isDown && this.player.time_since_last_shot % this.player.FIRE_RATE == 0) {

      var warning1 = game.add.text(game.width/4 - 75, game.height/3,'WARNING! WEAPONS ACTIVATION \nCAUSING FURTHER DAMAGE!', {fontSize: "28px", fill:"#FF0000"});
      warning1.anchor.setTo = 0.5;
      warning1.alpha = 0;
      var tween = game.add.tween(warning1).to( {alpha: 1}, 750, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
      var warning2 = game.add.text(120, game.height/2 + 180,'WARNING! Hull Unstable!', {fontSize: "28px", fill:"#FF0000"});
      warning2.anchor.setTo = 0.5;
      warning2.alpha = 0;
      var tween2 = game.add.tween(warning2).to( {alpha: 1}, 750, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
      this.shots_fired++;
      if(!this.alarm_sound.isPlaying) this.alarm_sound.play("", 0 , 0.5);
    }


    //restart upon death
    if(this.player.hp <= 0 && this.player.death_anim.isFinished) game.state.start('GameOver', true, false, false, this.main, this.alt, 'TutorialPt2');

    //collision checks
    this.all_enemy_bullets.forEach(this.bullet_collision, this);
    game.physics.arcade.overlap(this.enemies, this.player.bullets, this.damage, null, this);
    game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.crashing, null, this);

    //for testing purposes, Q triggers the ending of the tutorial
    if(game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()) this.ending();
		
    //debug cred: Nathan Altice inputs08.js
    if(game.input.keyboard.addKey(Phaser.KeyCode.T).justPressed()) {
      this.debug = !this.debug;
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
  //spawns an enemy that goes straight towards the player
	spawn: function() {
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
  //triggers all the enemies to fire
	fire: function() {
    if(this.enemies.countLiving() > 0)  	this.enemies.callAll("fire");
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
  //when a player reaches the end of the tutorial, allow the player to move again and prepare to advance to the next level
  ending: function() {
    this.warning_text.text = "SYSTEMS REPAIRED, MOVEMENT RESTORED";
    this.warning_text.fill = "#00FFFF";

    game.add.text(game.width/8, 170,"CAUTION: HULL STABILITY STILL LOW",{fontSize: "32px", fill:"#FFFF00"});
    game.add.text(game.width/8, 250,"PREPARE TO FIGHT THE BOSS...",{fontSize: "32px", fill:"#00FFFF"});
    this.movement = true;
    this.timer.add(6999, game.sound.stopAll, game.sound);
    this.timer.add(7000, game.state.start, game.state, "BossLevel", true, false, this.main, this.alt);
  }

};