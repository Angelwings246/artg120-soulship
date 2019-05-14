// Tutorial Part 1 Level State
'use strict';
var timer;
var Tutorial = function(game) {};
Tutorial.prototype = {
	preload: function() {
    //preload assets

    // load images
    game.load.path = "assets/img/";
    game.load.image("background", "bg.png");
    game.load.image("player", "player ship.png");
    game.load.image("bullet", "bullet.png");
    game.load.image("enemy", "enemy.png");
    game.load.image("asteroid", "Asteroid.png");
    game.load.image("asteroid2", "Asteroid2.png");
    game.load.image("stars", "Stars.png");
    game.load.image("stars2", "Stars2.png");
    game.load.image("heal", "hpDrop.png");
    game.load.image("hp bar", "hp bar.png");
    game.load.image("red", "hp red.png");

    // load audio
    game.load.path = "assets/audio/";

    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);


    game.load.audio("ouch", ["PlayerGetsHit.mp3"]);
    game.load.audio("panic", ["LowHP.mp3", "LowHP.ogg"], 1, true);
    game.load.audio("hit boss", ["EnemyGetsHit.mp3"]);
    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);

    game.load.audio("intro", ["music intro.mp3", "music intro.ogg"]);
    game.load.audio("loop", ["music loop.mp3", "music loop.ogg"]);

  },
	create: function(){

		//Temporary tutorial displays controls briefly
		// game.stage.backgroundColor = '#facade';
		game.add.image(0, 0, "background");

		var warningText = game.add.text(100, 200,'Use WASD to move\n' +
			'Spacebar to shoot (tap to spam, hold for continuous fire)\n'+
			'Each shot you fire hurts you!\n' +
			'Prepare to fight your greatest fears in 5 seconds....', {fontSize: "28px", fill:"#FFFFFF"});
		timer = 0;
		this.timer = game.time.create(false);
		this.timer.start();
	},
	update: function(){
		timer = (Math.floor(this.timer.seconds))+1;
		if (timer == 5){
			game.state.start('BossLevel');
		}
	}
};