// MainMenu state

var MainMenu = function(game) {};
MainMenu.prototype = {
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
			game.state.start('TutorialPt1');
		}
	}
};