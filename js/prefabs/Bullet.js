/** Prefab for Bullets/projectiles for use in a shoot-em-up type game 
 * 
 */
"use strict";

/* Bullet constructor:
 * Speed - refers only to magnitude.  Velocity is calculated with angle in construction.
IMPORTANT: ANGLE - IN RADIANS, WITH THE BASE ASSET FACING THE RIGHT (at 0)  Positive = clockwise, negative = counter-clockwise
Color - tints the bullet (format 0xFFFFFF).  The base asset is in greyscale.
Ally - boolean (T/F).  T refers to a bullet fired by the player. F refers to a bullet fired by an enemy.*/
function Bullet(game, x, y, speed, angle, color, damage, key, frame) {
  console.log("spawned bullet");
  //call Phaser.Sprite constructor (game, x, y, key, frame)
  Phaser.Sprite.call(this, game, x, y, key, frame);
  game.physics.arcade.enable(this);
  this.tint = color;
  this.body.setSize(5, 6); //make the trail part of the bullet not have collision
 
  //set up the direction and velocity
  this.anchor.set(0.5);
  this.body.rotation = angle;
  this.rotation = angle;
  this.body.velocity.x = speed * Math.cos(angle);
  this.body.velocity.y = speed * Math.sin(angle);
  
  this.lifespan = 30000; //semi-arbitrary lifespan so that bullets do not last forever.  Value will be iterated upon as necessary.
  this.dmg = damage;
}

//assign prototype and constructor
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

//update function
Bullet.prototype.update = function() {
  this.lifespan--;
  if(this.lifespan <= 0) this.destroy();
}