// Boss Level State

// be strict
'use strict';

var BossLevel = function(game){};
BossLevel.prototype = {
  init: function(main, alt, music_vol, sfx_vol) {
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
  },
	preload: function(){
   //all preloading done in Load state
	},
	create: function(){
	    game.sound.stopAll();

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
    this.intro = game.add.audio("boss intro");
    this.intro.play("", 0, this.music_vol);
    this.music = game.add.audio("boss loop", 1, true);

    //set up sounds
    this.void_hit = game.add.audio("void hit"); //take out these two guys to play them together
    this.boom = game.add.audio("boom"); 
    this.void_hit.onPlay.add(function() {this.boom.play("", 0, this.sfx_vol, false);}, this);

    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit
    this.boss_sounds = [this.void_hit, game.add.audio("pew"), game.add.audio("hit boss")];

    //ORDER OF SOUNDS: Death, Shooting, [Being] Hit, Low HP
    this.player_sounds = [this.boom, game.add.audio("pew"), game.add.audio("ouch"), game.add.audio("panic")];
    this.heal_sound = game.add.audio("heal");

    //Boss(game, sounds, key_main, frame_main, key_side, frame_side, volume)
    this.boss = new Boss(game, this.boss_sounds, "vortex", "vortex1", "tentacle", "idle3", this.sfx_vol);
    game.add.existing(this.boss);

    //PlayerShip(game, sounds, key, frame)  
    this.player = new PlayerShip(game, this.player_sounds, "player", "player ship broken", this.main, this.alt, this.sfx_vol);
    game.add.existing(this.player);

    this.target = game.add.sprite(0, 0, "target", 0);
    this.target.anchor.setTo(0.5);
    this.target.alpha = 0;

    //group of pickups (for now, just a heal)
    this.pickups = game.add.group();
    this.HEALING = 5; //value of heal pickup

    //timer for boss firing pattern
    //cred: Nathan Altice Paddle Parkour Redux
    this.timer = game.time.create(false);
    this.timer.add(0, this.fire, this); //fire at the start
    this.phase1 = this.timer.loop(3000, this.fire, this) //calls once every x milliseconds
    this.timer.start(); //don't forget to start timer

    this.victory = false; //switch to true if the player wins

    //player health bar is from a prefab
    this.health_bar = new HpBar(game, "hp bar", "hp bar01", "red", 0, this.player);
    this.health_bar.outer.animations.play("idle");
	},
	update: function() {
      
      //transition from the intro music to the loop
      this.intro.onStop.add(function() {this.music.play("", 0, this.music_vol)}, this);

      //collision checks
      //NOTE: Boss is an extension of Phaser.Group, so this should work.  Hopefully. 

      this.boss.bullets.forEach(this.bullet_collision, this);
      game.physics.arcade.overlap(this.boss.asteroids, this.player.bullets, this.damage);
      game.physics.arcade.overlap(this.boss, this.player.bullets, this.damage);
      game.physics.arcade.overlap(this.player, this.pickups, this.heal, null, this);
      game.physics.arcade.collide(this.player, this.boss, this.crashing, null, this);
      game.physics.arcade.overlap(this.player, this.boss.asteroids, this.crashing, null, this);

      //adjust timing of shots - in phase 2 (i.e. when the boss is < 50% HP) the attacks are more powerful
      //thus, to compensate, they fire less frequently
      if(this.boss.hp <= this.boss.MAX_HEALTH/2 && this.phase2 == null) {
          this.phase2 = this.timer.loop(6000, this.fire, this);
          this.timer.remove(this.phase1);
          // console.log(this.phase2);
      }

    //spawn a health pack when the first part of the boss dies
      if(this.boss.top_pt.exists && this.boss.top_pt.hp <= 0 && this.boss.hp > 1 && this.pickups.countLiving() == 0) {
        //Pickup(game, x, y, key, frame)
        var pickup = new Pickup(game, this.boss.top_pt.x, this.boss.top_pt.y, "heal", 0);
        this.pickups.add(pickup);
      }
      if(this.boss.bot_pt.exists && this.boss.bot_pt.hp <= 0 && this.boss.hp > 1 && this.pickups.countLiving() == 0) {
        var pickup = new Pickup(game, this.boss.bot_pt.x, this.boss.bot_pt.y, "heal", 0);
        this.pickups.add(pickup);
      }

	  // game ends when player or boss hits 0 hp
	  // also debug button to go to game over
	  if((this.player.hp <= 0 && this.player.death_anim.isFinished) || 
        (this.boss.hp <= 0 && this.boss.death_anim.isFinished) /*|| 
         game.input.keyboard.justPressed(Phaser.Keyboard.Q)*/){
		  if(this.boss.hp <= 0) this.victory = true;
      game.sound.stopAll();
      this.intro.onStop.removeAll(); //remove the trigger to play the next part of audio
      game.state.start('GameOver', true, false, this.victory, this.main, this.alt, this.music_vol, this.sfx_vol, 'BossLevel');
	  }
      // //debug cred: Nathan Altice inputs08.js
      // if(game.input.keyboard.addKey(Phaser.KeyCode.T).justPressed()) {
      //   this.debug = !this.debug;
      // }
    },
    render: function() {
      // if(this.debug) {
      //   //turn on all debug bodies
      //   game.debug.body(this.player);
      //   this.boss.forEach(game.debug.body, game.debug);
      //   this.boss.bullets.forEach(game.debug.body, game.debug);
      //   this.player.bullets.forEach(game.debug.body, game.debug);
      //   game.debug.text(this.timer.seconds, 50, 50);
      // }
    },
    //called in the loop for the boss to attack
	  fire: function() {
      if(this.boss.hp > 0) {
  	    var pattern = this.boss.fire(this.player.x, this.player.y); //simply call the fire function of boss, which has all of the functionality set up
        //add the target picture over the player for the correct fire pattern
        if(pattern == 2) {
          this.target.x = this.player.x;
          this.target.y = this.player.y;
          this.target.alpha = 1;
          this.timer.add(1000, function() {this.target.alpha = 0}, this);
        }
      }
    },
    //the character, be it player or enemy, takes damage
    damage: function(character, bullet) {
        //because of naming conventions, this should work for both the enemy AND the player
        if(character.body != null && (character instanceof Enemy || character instanceof PlayerShip)) { //don't try to call on things that don't take damage
            character.damage(bullet.dmg);
            bullet.destroy(); //destroy instead of kill to free memory
        }
    },
    //called when the player picks up a health pack
    heal: function(player, pickup) {
      if(player.hp > 0) {
        player.hp += this.HEALING;
        this.player.time_since_heal = 0;
        if(player.hp > player.PLAYER_MAX_HP) player.hp = player.PLAYER_MAX_HP; //don't let the player overflow on health
        this.heal_sound.play("", 0, this.sfx_vol);
        pickup.destroy();
      }
    },
    //called when the player crashes into an enemy_sounds
    crashing: function(player, enemy) {
        if(enemy.body != null && enemy instanceof Enemy) { //don't get hurt for colliding with vortex...for now.
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


