/** Prefab for the Enemy basic type.  Other enemy types will inherit from this enemy and adjust prototype if needed.
 */
"use strict";

/*Enemy constructor:
 * sounds - array of sounds that the enemy will play upon certain events. 
 * ORDER OF SOUNDS: Death, Shooting, [Being] Hit
 */
function Enemy(game, x, y, sounds, key, frame, animated) {
  console.log("enemy spawning at x: %s y: %s", x, y);
  //call Phaser.Sprite constructor (game, x, y, key, frame)
  Phaser.Sprite.call(this, game, x, y, key, frame);
  game.physics.arcade.enable(this);
  this.anchor.set(0.5);

  //attributes of the enemy, can be easily overridden
  this.hp = 1; // basic enemy dies in 1 hit
  // this.body.velocity.y = 100; //for now, have the basic enemy type scroll downwards at constant speed

  //stores the sounds for future playback
  this.death_sound = sounds[0];
  this.firing_sound = sounds[1];
  this.hit_sound = sounds[2];
  
  //adds a flag so that some enemies cannot shoot even if fire() is called
  this.can_fire = true;

  this.INVULN_FRAMES = 10;
  this.time_since_dmg = 10;

  this.bullets = game.add.group();
  this.dmg = 1;

  this.animated = animated;

  // checks and deletes offscreen enemies
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  //add animations
  if(this.animated) {
  this.animations.add("idle", Phaser.Animation.generateFrameNames(key, 1, 8, "", 1), 10, true);
  }
}

//assign prototype and constructor
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

//update function
Enemy.prototype.update = function() {
  if(this.animated) this.animations.play("idle");
  if(this.hp <= 0) this.death();

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
    console.log("pew");
    this.firing_sound.play();

// Bullet(game, x, y, speed, angle, color, damage, key, frame) 
    //var bullet = new Bullet(game, this.body.center.x, this.body.center.y, 150, 3/4 * Math.PI, 0xff0000, this.dmg, "bullet", 0);
    //this.bullets.add(bullet);
    var bullet = new Bullet(game, this.body.center.x, this.body.center.y, 150, Math.PI, 0xff0000, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    //bullet = new Bullet(game, this.body.center.x, this.body.center.y, 150, 5/4 * Math.PI, 0xff0000, this.dmg, "bullet", 0);
    //this.bullets.add(bullet);
  }
}

//it turns out this function already exists with Phaser.Sprite, but since I want to call .destroy() instead
//of .kill() (which calls when health = 0), I'll just override it and use .hp
Enemy.prototype.damage = function(dmg) {
  if(this.time_since_dmg >= this.INVULN_FRAMES) {
    this.hp -= dmg;
    this.time_since_dmg = 0;
    if(this.hp > 0) this.hit_sound.play();
  }
}
//overriding .kill() would just be confusing
Enemy.prototype.death = function() {
  this.death_sound.play();
  this.destroy(); //use .destroy instead of .kill() to actually remove the object from memory and save resources.
  }