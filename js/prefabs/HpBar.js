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
  this.outer = game.add.image(100, 525, key_outer, frame_outer);
  this.glow = game.add.image(100, 525, "glow");
  this.glow.alpha = 0;
  this.delta = 0.025;

  //need to be able to keep track of the player's hp, so store it 
  this.player = player;
}

//assign prototype and constructor
HpBar.prototype = Object.create(Phaser.Group.prototype);
HpBar.prototype.constructor = HpBar;

HpBar.prototype.update = function() {

  //update player hp bar
  this.health_bar.width = this.HP_WIDTH_MAX * this.player.hp/this.player.PLAYER_MAX_HP;
  if(this.player.hp < 0) this.health_bar.width = 0;

  if(this.player.hp < this.player.PLAYER_MAX_HP/4) {
    if(this.glow.alpha >= 1 || this.glow.alpha <= 0) this.delta *= -1;
    this.glow.alpha += this.delta;
  }

  if(this.player.time_since_dmg < 6) {
    this.health_bar.alpha = 0.7;
    this.glow.alpha += 0.25;
  }
  else if(this.player.hp >= this.player.PLAYER_MAX_HP/4) {
    this.health_bar.alpha = 1;
    this.glow.alpha -= 0.25;
  }
  else this.health_bar.alpha = 1;

  //bound the glow's alpha to stop weird stuff from happening
  if(this.glow.alpha < 0) this.glow.alpha = 0;
  if(this.glow.alpha > 1) this.glow.alpha = 1;

}
