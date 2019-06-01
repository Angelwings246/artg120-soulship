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
    game.load.image("restore defaults", "restore defaults.png");
    game.load.image("return to menu", "return to menu.png");
    game.load.atlas("player", "player.png", "player.json");
    game.load.atlas("flame", "flame.png", "flame.json");
    game.load.image("bullet", "bullet.png");
    game.load.atlas("enemy", "enemy.png", "enemy.json");
    game.load.image("boss main", "vortex.png");
    // game.load.image("asteroid", "Asteroid.png");
    // game.load.image("asteroid2", "Asteroid2.png");
    game.load.image("stars", "Stars.png");
    game.load.image("stars2", "Stars2.png");
    game.load.image("heal", "hpDrop.png");
    game.load.image("hp bar", "hp bar pt 1.png");
    game.load.image("corrupt bar", "hp bar.png");
    game.load.image("glow", "hp bar glow.png");
    game.load.image("red", "hp red.png");
    game.load.image("tentacle", "tentacle.png");
    game.load.atlas("tentacle_idle", "tentacle_idle.png", "tentacle_idle.json");
    game.load.atlas("button", "button.png", "button.json");
    // game.load.image("button dark", "button dark.png");
    // game.load.image("button light", "button light.png");


    // load the Cutscene1 images
    game.load.path = 'cutscenes/Cutscene1/';
    game.load.image('1commdevice', '1 comm device.png');
    game.load.image('2asteroidbelt', '2 Asteroid belt.png');
    game.load.image('3computerwarningblack', '3 computer warning black.png');
    game.load.image('3computerwarningdarker', '3 computer warning darker.png');
    game.load.image('3computerwarninglighter', '3 computer warning lighter.png');
    game.load.image('4controls', '4 controls.png');


    // load the Cutscene2 images
    game.load.path = "cutscenes/Cutscene2/";
    game.load.image("1alarmsoff", "1 alarms off.png");
    game.load.image("1alarmson", "1 alarms on.png"); 
    game.load.image("1alarmsrays", "1 alarms rays.png");
    game.load.image("2_12computerwarningblack", "2 _ 12 computer warning black.png");
    game.load.image("2_12computerwarningdarker", "2 _ 12 computer warning darker.png");
    game.load.image("2_12computerwarninglighter", "2 _ 12 computer warning lighter.png");
    game.load.image("3tentaclesattackoff", "3 tentacles attack off.png");
    game.load.image("3tentaclesattackon", "3 tentacles attack on.png");
    game.load.image("3tentaclesattackrays", "3 tentacles attack rays.png");
    game.load.image("4commdevice", "4 comm device.png");
    game.load.image("5monster", "5 monster.png");
    game.load.image("6firebutton", "6 fire button.png");
    game.load.image('7firebuttonpusheddown', "7 fire button pushed down.png");
    game.load.image('8shipfires', '8 ship fires.png');
    game.load.image('9tentaclesadvanceoff','9 tentacles advance off.png');
    game.load.image('9tentaclesadvanceon','9 tentacles advance on.png');
    game.load.image('9tentaclesadvancerays','9 tentacles advance rays.png');
    game.load.image('10shipattacked', '10 ship attacked.png');
    game.load.image('11monsterexplodes', '11 monster explodes.png');
    game.load.image('13fullattack', '13 full attack.png');



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
        // load cutscenes


	},
	create: function(){
		game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);

	}
};