// Tutorial Part 2 Level State
'use strict';
var timer;
var TutorialPt2 = function(game) {};
TutorialPt2.prototype = {
	preload: function() {
    
    //preload assets
	game.load.path = "assets/img/";
    game.load.image("background", "bg.png");

    game.load.image("player", "player ship.png");
    game.load.image("player broken", "player ship broken.png");
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

    game.load.audio("intro", ["music intro.mp3", "music intro.ogg"]);
    game.load.audio("loop", ["music loop.mp3", "music loop.ogg"]);
	
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

    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("hit")];

    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit, Low HP
    this.player_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];

    //PlayerShip(game, sounds, key, frame)  
    this.player = new PlayerShip(game, this.player_sounds, "player", 0);
    game.add.existing(this.player);
    this.player.body.x = this.startX = game.width/4;
    this.player.body.y = this.startY = game.height/2;

    //add the group of enemies and a counter for enemies spawned
    this.enemies = game.add.group();
    this.enemies_spawned = 0;
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

    this.warning_text = game.add.text(game.width/8, 100,"!--WARNING: ENGINES DAMAGED--!",{fontSize: "32px", fill:"#FF0000"});

    //player's hp bar is from a prefab
    this.health_bar = new HpBar(game, "hp bar", 0, "red", 0, this.player);

    this.movement = false; //flag to lock player movement

    this.ready = false; //swap to true when the player is deemed ready to move on
	},
	update: function(){

		//lock player movement
		if(!this.movement) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.body.x = this.startX;
      this.player.body.y = this.startY;
    }

    //spawn a health pickup if the player gets too low, because this is the tutorial. We're being nice.
    if(this.player.hp < this.player.PLAYER_MAX_HP/3 && this.pickups.countLiving() == 0) {
      var pickup = new Pickup(game, game.width, game.height/2, "heal", 0);
      this.pickups.add(pickup);
    }
    
    //the player is ready to continue once all enemies are spawned and destroyed
    if(this.enemies_spawned >= 10 && this.enemies.countLiving() == 0 && !this.ready) {
      this.ready = true;
        if(this.pickups.countLiving() == 0) { //if there is none already, spawn a health pack so the ending can be triggered
        var pickup = new Pickup(game, game.width, game.height/2, "heal", 0);
        this.pickups.add(pickup);
      }
    }

    //restart upon death
    if(this.player.hp <= 0) game.state.start('TutorialPt2');

    //collision checks
    this.all_enemy_bullets.forEach(this.bullet_collision, this);
    game.physics.arcade.overlap(this.enemies, this.player.bullets, this.damage);
    game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.crashing, null, this);

    //for testing purposes, R triggers the ending of the tutorial
    if(game.input.keyboard.addKey(Phaser.KeyCode.R).justPressed()) this.ending();
		
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
    if(this.enemies_spawned < 10) {
  		var enemy = new Enemy(game, game.width + 100, game.height/2, this.enemy_sounds, "enemy", 0);
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
      if(enemy.parent != this.boss) enemy.destroy(); //destroy non-boss enemies upon crashing
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
    game.add.text(game.width/8, 200,"PREPARE TO FIGHT THE BOSS...",{fontSize: "32px", fill:"#00FFFF"});
    this.movement = true;
    this.timer.add(7000, game.state.start, game.state, "BossLevel");
  }

};