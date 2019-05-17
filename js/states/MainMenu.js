// MainMenu state

var MainMenu = function(game) {};
MainMenu.prototype = {
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
	},
	preload: function() {
    //preload assets
	  game.load.path = "assets/img/";
    game.load.image("background", "bg.png");

	},
	create: function(){
		// game.stage.backgroundColor = '#facade';
		game.add.image(0, 0, "background");
		var titleText = game.add.text(game.width/4, game.height/2, 'Soul Ship', {fontSize: "32px", fill:"#FFFFFF"});
		var instructionText = game.add.text(game.width/4, game.height/2 + 50,'Press SPACEBAR to start', {fontSize: "32px", fill:"#FFFFFF"});
		// var controlsText = game.add.text(game.width/2, game.height/2 + 150, 'Use WASD to move');
	},
	update: function(){
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Tutorial', true, false, this.main, this.alt);
		}
	}
};