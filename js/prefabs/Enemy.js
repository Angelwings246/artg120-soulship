/** Prefab for the Enemy basic type.  Other enemy types will inherit from this enemy and adjust prototype if needed.
 */
"use strict";

/*Enemy constructor:
 * sounds - array of sounds that the enemy will play upon certain events.  [0] = death sound, [1] = fire sound
 */
function Enemy(game, x, y, sounds, key, frame) {
  console.log("enemy spawning at x: %s y: %s", x, y);
  //call Phaser.Sprite constructor (game, x, y, key, frame)
  Phaser.Sprite.call(this, game, x, y, key, frame);
  game.physics.arcade.enable(this);
  this.anchor.set(0.5);

  //attributes of the enemy, can be easily overridden
  this.hp = 1; // basic enemy dies in 1 hit
  this.body.velocity.y = 100; //for now, have the basic enemy type scroll downwards at constant speed

  //stores the sounds for future playback
  this.firing_sound = sounds[1];
  this.death_sound = sounds[0];
  
  //adds a flag so that some enemies cannot shoot even if fire() is called
  this.can_fire = true;
}

//assign prototype and constructor
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

//update function
Enemy.prototype.update = function() {
  if(this.hp <= 0) this.death();
}
//fire function: currently plays the shooting noise and fires a 3-bullet spread
Enemy.prototype.fire = function() {
  if(this.can_fire) {
    console.log("pew");
    this.firing_sound.play();

    //Bullet(game, x, y, speed, angle, color, ally, key, frame)
    var bullet = new Bullet(game, this.body.center.x, this.body.center.y, 50, 3/4 * Math.PI, 0xff0000, false, "bullet", 0);
    game.add.existing(bullet);
    bullet = new Bullet(game, this.body.center.x, this.body.center.y, 50, Math.PI, 0xff0000, false, "bullet", 0);
    game.add.existing(bullet);
    bullet = new Bullet(game, this.body.center.x, this.body.center.y, 50, 5/4 * Math.PI, 0xff0000, false, "bullet", 0);
    game.add.existing(bullet);
  }
}

//it turns out this function already exists with Phaser.Sprite, but since I want to call .destroy() instead
//of .kill() (which calls when health = 0), I'll just override it and use .hp
Enemy.prototype.damage = function(dmg) {
  this.hp -= dmg;
}
//overriding .kill() would just be confusing
Enemy.prototype.death = function() {
  console.log("ow");
  this.death_sound.play();
  this.destroy(); //use .destroy instead of .kill() to actually remove the object from memory and save resources.
  }