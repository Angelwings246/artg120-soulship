/** Prefab for health pickups
 *  Now moves in a slight zigzag
 */
"use strict";

function Pickup(game, x, y, key, frame) {
  //call Phaser.Sprite constructor (game, x, y, key, frame)
  Phaser.Sprite.call(this, game, x, y, key, frame);
  
  //enable physics and add properties
  game.physics.arcade.enable(this);
  this.starty = y;
  this.body.velocity.x = -50;
  this.body.velocity.y = -20;
}

//assign prototype and constructor
Pickup.prototype = Object.create(Phaser.Sprite.prototype);
Pickup.prototype.constructor = Pickup;

Pickup.prototype.update = function() {
  if(Math.abs(this.body.y - this.starty) >= 35) this.body.velocity.y *= -1;
}
