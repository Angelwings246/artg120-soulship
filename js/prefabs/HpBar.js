/** Prefab for health bar
 */
"use strict";

/*Outer refers to the box/frame of the bar
* Inner refers to the actual red bar itself
*/
function HpBar(game, key_outer, frame_outer, key_inner, frame_inner, player) {
  //call Phaser.Group constructor, as the hp bar consists of 2 separate images
  Phaser.Group.call(this, game);
  
  //hp bar displaying player health
  this.health_bar = game.add.image(115, 542, key_inner, frame_inner);
  this.HP_WIDTH_MAX = this.health_bar.width;
  game.add.image(100, 525, key_outer, frame_outer);

  //need to be able to keep track of the player's hp, so store it 
  this.player = player;
}

//assign prototype and constructor
HpBar.prototype = Object.create(Phaser.Group.prototype);
HpBar.prototype.constructor = HpBar;

HpBar.prototype.update = function() {

  //update player hp bar
  this.health_bar.width = this.HP_WIDTH_MAX * this.player.hp/this.player.PLAYER_MAX_HP;
  if(this.player.time_since_dmg < 4) this.health_bar.alpha = 0.7;
  else this.health_bar.alpha = 1;
}
