/** Testing File
 * 
 */

"use strict";
//define game
var width = 1024;
var height = 720;
var game = new Phaser.Game(width, height, Phaser.AUTO);
//define Play state
var Play = function(game) {
};
Play.prototype = {
    init: function() {
    
    },
    preload: function() {
    //load in all assets
      game.load.path = "assets/img/";

      game.load.image("enemy", "enemy.png");
      game.load.image("bullet", "bullet.png");
      game.load.image("boss main", "bossVortex.png");
      game.load.image("boss tentacle", "Boss Tentacle.png");
      
      game.load.path = "assets/audio/";
      game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
      game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);
//      game.load.audio("music", ["music.mp3", "music.ogg"]);
    },
    create: function() {
      
      game.stage.backgroundColor = "#f9f3ea";
      
      this.enemy_sounds = [game.add.audio("boom"), game.add.audio("pew")];
      //Boss(game, sounds, key_main, frame_main, key_side, frame_side)
      // this.enemy1 = new Boss(game, this.enemy_sounds, "boss main", 0, "boss tentacle", 0);
     this.enemy1 = new Enemy(game, 500, 1/4 * game.height, this.enemy_sounds, "boss main", 0);
      var boss = game.add.existing(this.enemy1);
    },
    update: function() {
      if(this.enemy1 != null && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.enemy1.fire();
        }
//      if(this.enemy1 != null && this.enemy1.body.y >= 3*height/4) {
//        this.enemy1.hp--;
//      }
//      if(this.enemy1 != null && game.input.keyboard.addKey(Phaser.KeyCode.R).justPressed()) this.enemy1.body.velocity.y *= -1;
    }
}

game.state.add("Play", Play);
game.state.start("Play");