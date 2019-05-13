// Boss Level State

// be strict
'use strict';
//
//	var frames;
//	var timer;

var BossLevel = function(game){};
BossLevel.prototype = {
	preload: function(){
    
    //preload assets
	game.load.path = "assets/img/";
    game.load.image("background", "bg.png");

    game.load.image("player", "player ship.png");
    game.load.image("player broken", "player ship broken.png");
    game.load.image("enemy", "enemy.png");
    game.load.image("bullet", "bullet.png");
    game.load.image("boss main", "vortex.png");
    game.load.image("boss tentacle", "tentacle.png");
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
    game.load.audio("hit boss", ["EnemyGetsHit.mp3"]);
    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);

    game.load.audio("intro", ["music intro.mp3", "music intro.ogg"]);
    game.load.audio("loop", ["music loop.mp3", "music loop.ogg"]);
	},
	create: function(){
	
    //set up scrolling background with multiple layers of stars
    //scroll speed is set to all be coprime so the loops are less frequent/obvious  
    this.background = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "background");
    this.background.autoScroll(-25, 0);
    game.add.existing(this.background);
    this.stars = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars");
    this.stars.autoScroll(-71, 0);
    this.stars.alpha = 0.9;
    game.add.existing(this.stars);
    this.stars2 = new Phaser.TileSprite(game, 0, 0, game.width, game.height, "stars2");
    this.stars2.autoScroll(-43, 0);
    game.add.existing(this.stars2);
    this.stars2.alpha = 0.4;

    //set up music
    this.intro = game.add.audio("intro");
    this.intro.play();
    this.music = game.add.audio("loop", 1, true);

    //set up sounds
    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit
    this.boss_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("hit boss")];

    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit, Low HP
    this.player_sounds = [game.add.audio("boom"), game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];

    this.heal_sound = game.add.audio("heal");

    //Boss(game, sounds, key_main, frame_main, key_side, frame_side)
    this.boss = new Boss(game, this.boss_sounds, "boss main", 0, "boss tentacle", 0);
    game.add.existing(this.boss);

    //PlayerShip(game, sounds, key, frame)  
    this.player = new PlayerShip(game, this.player_sounds, "player", 0);
    game.add.existing(this.player);

    //group of pickups (for now, just a heal)
    this.pickups = game.add.group();
    this.HEALING = 5; //value of heal pickup

    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux
    this.timer = game.time.create(false);
    this.timer.add(0, this.fire, this); //fire at the start
    this.phase1 = this.timer.loop(5000, this.fire, this) //calls once every x milliseconds NOTE WILL PROBABLY ADJUST ONCE ANIMS ARE IN
    this.timer.start(); //don't forget to start timer

    //text to show HP before we get bars working
    // this.player_hp_text = game.add.text(game.width/8, game.height - 100,"Player HP: " + this.player.hp, {fontSize: "32px", fill:"#FFFFFF"});
    this.boss_hp_text = game.add.text(3* game.width/4, game.height - 100,"Boss HP: " + this.boss.hp, {fontSize: "32px", fill:"#FFFFFF"});

    this.victory = false; //switch to true if the player wins

    //hp bar displaying player health
    this.health_bar = game.add.image(115, 542, "red");
    this.hp_width = 298; 
    game.add.image(100, 525, "hp bar");

	},
	update: function() {
      
      //transition from the intro music to the loop
      this.intro.onStop.add(function() {this.music.play()}, this);

      //collision checks
      //NOTE: Boss is an extension of Phaser.Group, so this should work.  Hopefully. 

      this.boss.bullets.forEach(this.bullet_collision, this);
      // game.physics.arcade.overlap(this.player, this.boss.bullets, this.damage);
      game.physics.arcade.overlap(this.boss.asteroids, this.player.bullets, this.damage);
      game.physics.arcade.overlap(this.boss, this.player.bullets, this.damage);
      game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
      game.physics.arcade.overlap(this.player, this.boss, this.crashing, null, this);
      game.physics.arcade.overlap(this.player, this.boss.asteroids, this.crashing, null, this);

      //adjust timing of shots - in phase 2 (i.e. when the boss is < 50% HP) the attacks are more powerful
      //thus, to compensate, they fire less frequently
      if(this.boss.hp < this.boss.MAX_HEALTH/2 && this.phase2 == null) {
          this.phase2 = this.timer.loop(15000, this.fire, this);
          this.timer.remove(this.phase1);
      }
      

      //update text
      // this.player_hp_text.text = "Player HP: " + this.player.hp; //update each frame because we don't know when the player will fire
      this.boss_hp_text.text = "Boss HP: " + this.boss.hp; 

      //update player hp bar
      this.health_bar.width = this.hp_width * this.player.hp/this.player.PLAYER_MAX_HP;
      if(this.player.time_since_dmg < 4) this.health_bar.alpha = 0.7;
      else this.health_bar.alpha = 1;
    
      //spawn a health pack when the first part of the boss dies
      if(this.boss.top_pt.exists && this.boss.top_pt.hp <= 0 && this.boss.hp > 1) {
        //Pickup(game, x, y, key, frame)
        var pickup = new Pickup(game, this.boss.top_pt.x, this.boss.top_pt.y, "heal", 0);
        this.pickups.add(pickup);
      }
      if(this.boss.bot_pt.exists && this.boss.bot_pt.hp <= 0 && this.boss.hp > 1) {
        var pickup = new Pickup(game, this.boss.bot_pt.x, this.boss.bot_pt.y, "heal", 0);
        this.pickups.add(pickup);
      }

	 // game ends when player or boss hits 0 hp
	  // also debug button to go to game over
	  if(this.player.hp <= 0 || this.boss.hp <= 0 || game.input.keyboard.justPressed(Phaser.Keyboard.Q)){
		if(this.boss.hp <= 0) this.victory = true;
        game.sound.stopAll();
        game.state.start('GameOver', true, false, this.victory);
	  }
      //debug cred: Nathan Altice inputs08.js
      if(game.input.keyboard.addKey(Phaser.KeyCode.T).justPressed()) {
        this.debug = !this.debug;
      }
    },
    render: function() {
      if(this.debug) {
        //turn on all debug bodies
        game.debug.body(this.player);
        this.boss.forEach(game.debug.body, game.debug);
        this.boss.bullets.forEach(game.debug.body, game.debug);
        this.player.bullets.forEach(game.debug.body, game.debug);
        game.debug.text(this.timer.seconds, 50, 50);
      }
    },
    //called in the loop for the boss to attack
	fire: function() {
	  this.boss.fire(this.player.x, this.player.y); //simply call the fire function of boss, which has all of the functionality set up
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
    },
    //called when the player crashes into an enemy_sounds
    crashing: function(player, enemy) {
        if(enemy.body != null) {
            player.damage(3); //arbitrary number for now
            if(enemy.parent != this.boss) enemy.destroy(); //destroy non-boss enemies upon crashing
        }
    },
    //to save a slight amount of processing power, only checks overlap for those bullets within a certain band of x-values
    //of the player.  this means that some bullets are checked twice (in the band + overlap) but others will only be
    //partially checked (in the band - only checks x-value, not y-value).  at least i think this is better.
    bullet_collision: function(bullet){
      if(bullet.x > this.player.body.x-64 && bullet.x < this.player.body.x + 64)  game.physics.arcade.overlap(this.player, bullet, this.damage);
    }

};


