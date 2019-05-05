/** Prefab for health pickups
 * 
 */
"use strict";

function Pickup(game, x, y, key, frame) {
  //call Phaser.Sprite constructor (game, x, y, key, frame)
  Phaser.Sprite.call(this, game, x, y, key, frame);
  
  //enable physics and add properties
  game.physics.arcade.enable(this);
  this.velocity.x = 50;

}

//assign prototype and constructor
Pickup.prototype = Object.create(Phaser.Sprite.prototype);
Pickup.prototype.constructor = Pickup;

Pickup.prototype.update = function() {
}
