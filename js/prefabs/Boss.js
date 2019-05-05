/**
 * 
 */

"use strict";

//key_main and frame_main are for the center part of the boss.
//key_side and frame_side are for the side/weak parts of the boss.
function Boss(game, sounds, key_main, frame_main, key_side, frame_side) {
  Phaser.Group.call(this, game);
  //create a normal sprite for the center 
  this.center_pt = this.create(3/4 * game.width, game.height/2, key_main, frame_main);
  this.center_pt.anchor.setTo(0.5);
  
  //then Enemy types for the weak spots.  Note that .create() cannot be used because of constructor difference
  //Enemy(game, x, y, sounds, key, frame)
  var top_pt = new Enemy(game, 3/4 * game.width, game.height/2, sounds, key_side, frame_side);
  var bot_pt = new Enemy(game, 3/4 * game.width, game.height/2, sounds, key_side, frame_side);
  //add them to group
  this.top_pt = this.add(top_pt);
  this.bot_pt = this.add(bot_pt);

  //health properties - max health refers to the boss health total
  //it is automatically split evenly between the two weak points
  this.MAX_HEALTH = 100;
  this.top_pt.hp = this.bot_pt.hp = this.MAX_HEALTH/2;
  
  //remove the default velocity from Enemy()
  this.top_pt.body.velocity.y = this.bot_pt.body.velocity.y = 0;
  
  //set up the rotation
  this.top_pt.anchor.setTo(0.5);
  this.bot_pt.anchor.setTo(0.5);
  this.bot_pt.rotation = Math.PI;
  this.top_pt.pivot.y = this.center_pt.height/4;
  this.bot_pt.pivot.y = this.center_pt.height/4;
  
  //have a flag so that rotation can stop if needed
  this.rotating = false;

}


//assign prototype and constructor
Boss.prototype = Object.create(Phaser.Group.prototype); //create with the GROUP prototype! ... and hope it works
Boss.prototype.constructor = Boss;

Boss.prototype.update = function() {
  if(this.rotating) {
    this.top_pt.rotation += 0.01;
    this.center_pt.rotation += 0.01;
    this.bot_pt.rotation += 0.01;
  }
  if(game.input.keyboard.addKey(Phaser.KeyCode.R).justPressed()) {
    this.rotating = !this.rotating;
    console.log(this.rotating)
  }

  if(this.top_pt.hp == 0 && this.bot_pt.hp == 0) this.death();
}

Boss.prototype.death = function() {
  console.log("ded");
}

Boss.prototype.fire = function() {
  var pattern = game.rnd.integerInRange(0, 3);
  switch(pattern) {
//    case 0:
//      if(this.hp > this.MAX_HEALTH/2) this.fire1a();
//      else this.fire1b();
//      break;
//    case 1:
//      if(this.hp > this.MAX_HEALTH/2) this.fire2a();
//      else this.fire2b();
//      break;
//    case 2:
//      if(this.hp > this.MAX_HEALTH/2) this.fire3a();
//      else this.fire3b();
//      break;
//    case 3:
//      if(this.hp > this.MAX_HEALTH/2) this.fire3a();
//      else this.fire3b();
//      break;
    default:
      this.top_pt.fire();
      this.bot_pt.fire();
      break;
  }  
  console.log("pew pew" + pattern);

}
