/** Prefab for the Enemy basic type.  Other enemy types will inherit from this enemy and adjust prototype if needed.
 */
"use strict";

/*Enemy constructor:
 * sounds - array of sounds that the enemy will play upon certain events. 
 * ORDER OF SOUNDS: Death, Shooting, [Being] Hit
 */
function Enemy(game, x, y, sounds, key, frame, volume, animated) {
  // console.log("enemy spawning at x: %s y: %s", x, y);
  //call Phaser.Sprite constructor (game, x, y, key, frame)
  Phaser.Sprite.call(this, game, x, y, key, frame);
  game.physics.arcade.enable(this);
  this.anchor.set(0.5);

  //attributes of the enemy, can be easily overridden
  this.hp = 1; // basic enemy dies in 1 hit

  //stores the sounds for future playback
  this.death_sound = sounds[0];
  this.firing_sound = sounds[1];
  this.hit_sound = sounds[2];
  this.volume = volume;
  
  //adds a flag so that some enemies cannot shoot even if fire() is called
  this.can_fire = true;

  this.INVULN_FRAMES = 10;
  this.time_since_dmg = 10;

  this.bullets = game.add.group();
  this.dmg = 1;
  this.dead = false;
  this.animated = animated;

  // checks and deletes offscreen enemies
  this.checkWorldBounds = true;
  this.outOfBoundsKill = false;
  // this.outOfBoundsKill = true;

  //used to have the enemies move on a set path, see follow_path below
  this.path = null;
  this.path_index = 0;

  //add animations
  if(key == "tentacle") {
    this.animations.add("idle", Phaser.Animation.generateFrameNames("idle", 1, 8, "", 1), 10, true);
    this.death_anim = this.animations.add("death", Phaser.Animation.generateFrameNames("death", 1, 12, "", 2), 10, false);
  }
  else if (key == "enemy") {
      this.death_anim = this.animations.add("death", Phaser.Animation.generateFrameNames("death", 1, 5, "", 1), 8, false);
  }
}

//assign prototype and constructor
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

//update function
Enemy.prototype.update = function() {
  //buffer the outofboundskill so that objects that spawn offscreen don't instantly die
  if(this.body != null && (this.body.x < game.width/2 || this.body.y < 0 || this.body.y > game.height)) this.outOfBoundsKill = true;

  if(this.path != null && this.body != null) this.follow_path();

  if(this.animated) this.animations.play("idle");
  if(this.hp <= 0) {
    this.death();
  }

  //feedback for taking damage: flash red, then blink during invulnerability
  if(this.time_since_dmg < this.INVULN_FRAMES) {
    if(this.time_since_dmg < 4) this.tint = 0xFF0000;
    else if(this.time_since_dmg % 4 == 0) {
      this.tint = 0xFFFFFF;
      this.alpha = 0.5;
    }
    else {
      this.alpha = 1;
    }
  }
  //make sure to turn stuff back to normal
  else {
    this.tint = 0xFFFFFF;
    this.alpha = 1;
  }
  
  this.time_since_dmg++;


}
//fire function: currently plays the shooting noise and fires a 3-bullet spread
Enemy.prototype.fire = function() {
  if(this.can_fire) {
    // console.log("pew");
    this.firing_sound.play("", 0, this.volume);

// Bullet(game, x, y, speed, angle, color, damage, key, frame) 
    //var bullet = new Bullet(game, this.body.center.x, this.body.center.y, 150, 3/4 * Math.PI, 0xff0000, this.dmg, "bullet", 0);
    //this.bullets.add(bullet);
    var bullet = new Bullet(game, this.body.center.x, this.body.center.y, 250, Math.PI, 0xff0000, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
  }
}

//it turns out this function already exists with Phaser.Sprite, but since I want to call .destroy() instead
//of .kill() (which calls when health = 0), I'll just override it and use .hp
Enemy.prototype.damage = function(dmg) {
  if(this.time_since_dmg >= this.INVULN_FRAMES) {
    this.hp -= dmg;
    this.time_since_dmg = 0;
    if(this.hp > 0) this.hit_sound.play("", 0, this.volume);
  }
}
//overriding .kill() would just be confusing
Enemy.prototype.death = function() {
  //stop the sound from playing twice
  if(!this.dead) {
    this.death_sound.play("", 0, this.volume);
    this.dead = true;
    console.log("boom");
    console.log(this.death_sound);
  }
  this.can_fire = false;
  this.body = null;
  if(this.death_anim != null) {
    if(this.death_anim.isFinished) {
      this.destroy();
    }
    this.animations.play("death");
    this.alpha = 0.7;
  }
  else {
  this.destroy(); //use .destroy instead of .kill() to actually remove the object from memory and save resources.
  }
}
/*if the enemy has a path, given to it by setting path an object (containing 2 objects, points and vels, each having
* an x and y property of equal length arrays), then use those paths to determine movement.
* the rounding is all in there because counting is weird
* this.path_index determines which point we are hitting.
*/
Enemy.prototype.follow_path = function() {
  if (this.path_index < this.path.points.x.length) {
    if(Math.round(this.body.center.x) - Math.round(this.path.points.x[this.path_index]) <= 2 && 
      Math.round(this.body.center.y) - Math.round(this.path.points.y[this.path_index]) <= 2) { //giving it a bit of flexibility 
      this.body.velocity.x = this.path.vels.x[this.path_index]; //set velocities
      this.body.velocity.y = this.path.vels.y[this.path_index];
      this.path_index++;
    }
  }

}