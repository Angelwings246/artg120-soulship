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
    game.load.image("enemy", "enemy.png");
    game.load.image("bullet", "bullet.png");
    game.load.image("boss main", "vortex.png");
    game.load.image("boss tentacle", "tentacle.png");
    game.load.image("heal", "hpDrop.png");
    game.load.image("stars", "Stars.png");
    game.load.image("stars2", "Stars2.png");
    game.load.image("asteroid", "Asteroid.png");
    game.load.image("asteroid2", "Asteroid2.png");


    game.load.path = "assets/audio/";
    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);
//    game.load.audio("music", ["music.mp3", "music.ogg"]);
	  

	},
	create: function(){
	  
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

    //set up sounds
    this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew")];

    //Boss(game, sounds, key_main, frame_main, key_side, frame_side)
    this.boss = new Boss(game, this.enemy_sounds, "boss main", 0, "boss tentacle", 0);
    game.add.existing(this.boss);

    //Playership(game, sounds, key, frame)    
    this.player = new PlayerShip(game, this.enemy_sounds, "player", 0);
    game.add.existing(this.player);

    this.pickups = game.add.group();
    this.HEALING = 5;

    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux
    this.timer = game.time.create(false);
    this.phase1 = this.timer.loop(5000, this.fire, this) //calls once every x milliseconds NOTE WILL PROBABLY ADJUST ONCE ANIMS ARE IN
    this.timer.start(); //don't forget to start timer

    //text to show HP before we get bars working
    this.player_hp_text = game.add.text(game.width/8, game.height - 100,"Player HP: " + this.player.hp, {fontSize: "32px", fill:"#FFFFFF"});
    this.boss_hp_text = game.add.text(3* game.width/4, game.height - 100,"Boss HP: " + this.boss.hp, {fontSize: "32px", fill:"#FFFFFF"});

    this.victory = false; //switch to true if the player wins

	},
	update: function() {
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
          this.phase2 = this.timer.loop(10000, this.fire, this);
          this.timer.remove(this.phase1);
      }
      

      //update text
      this.player_hp_text.text = "Player HP: " + this.player.hp; //update each frame because we don't know when the player will fire
      this.boss_hp_text.text = "Boss HP: " + this.boss.hp; 
    
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
	  console.log(this.boss.bullets);

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
        if(player.hp > player.PLAYER_MAX_HP) player.hp = player.PLAYER_MAX_HP;
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


