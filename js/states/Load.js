// Load state

var Load = function(game) {};
Load.prototype = {
	init: function() {
		    this.main = {
          'up': Phaser.KeyCode.UP,
          'down': Phaser.KeyCode.DOWN,
          'left': Phaser.KeyCode.LEFT,
          'right': Phaser.KeyCode.RIGHT,
          'fire': Phaser.KeyCode.SPACEBAR
       };
      this.alt = {
          'up': Phaser.KeyCode.W, 
          'down': Phaser.KeyCode.S,
          'left': Phaser.KeyCode.A, 
          'right': Phaser.KeyCode.D,
          'fire': Phaser.KeyCode.SPACEBAR
       };
      this.music_vol = 1;
      this.sfx_vol = 1;
    },
	preload: function(){

    //preload assets
    //load all image files, atlases, fonts
	  game.load.path = "assets/img/";
    game.load.image("background", "bg.png");
    game.load.bitmapFont("aldrich64", "aldrich64.png", "aldrich64.fnt");
    game.load.image("start adventure", "start adventure.png");
    game.load.image("options", "options.png");
    game.load.image("credits", "credits.png");
    game.load.atlas("player", "player.png", "player.json");
    game.load.image("bullet", "bullet.png");
    game.load.image("enemy", "enemy.png");
    game.load.image("boss main", "vortex.png");
    game.load.image("asteroid", "Asteroid.png");
    game.load.image("asteroid2", "Asteroid2.png");
    game.load.image("stars", "Stars.png");
    game.load.image("stars2", "Stars2.png");
    game.load.image("heal", "hpDrop.png");
    game.load.image("hp bar", "hp bar pt 1.png");
    game.load.image("corrupt bar", "hp bar.png");
    game.load.image("glow", "hp bar glow.png");
    game.load.image("red", "hp red.png");
    game.load.image("tentacle", "tentacle.png");
    game.load.atlas("tentacle_idle", "tentacle_idle.png", "tentacle_idle.json");
    game.load.image("button dark", "button dark.png");
    game.load.image("button light", "button light.png");


    //load all audio files
    game.load.path = "assets/audio/";
    game.load.audio("MainMenu", ["MainMenu.mp3", "MainMenu.ogg"], 1, true);
    game.load.audio("transmission", ["Transmission.mp3"]);
    game.load.audio("boom", ["boom1.mp3", "boom1.ogg"]);
    game.load.audio("pew", ["shoot2.mp3", "shoot2.ogg"]);
    game.load.audio("ouch", ["PlayerGetsHit.mp3"]);
    game.load.audio("panic", ["LowHP.mp3", "LowHP.ogg"], 1, true);
    game.load.audio("hit", ["EnemyGetsHit.mp3"]);
    game.load.audio("hit boss", ["EnemyGetsHit.mp3"]);
    game.load.audio("heal", ["HealthUp2.mp3", "HealthUp2.ogg"]);
    game.load.audio('alarm', ["Alarm.mp3", "Alarm.ogg"]);


    game.load.audio("boss intro", ["music intro.mp3", "music intro.ogg"]);
    game.load.audio("boss loop", ["music loop.mp3", "music loop.ogg"]);

		//create Loading bar image
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		//load graphics assets
		//game.load.image('tempship', 'assets/img/tempship.png');		

	},
	create: function(){
		game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);

	}
};