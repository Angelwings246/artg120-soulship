// Soul Ship (Working Title)
// by Hunter Lynch, Angel Tan, Taylor Fagundes
// 5/1/19
// Enjoy!

// main.js, heavily inspired by Nathan Altice main.js

"use strict";

// define global variables
var game;

// implement more as we go


window.onload = function(){

	game = new Phaser.Game(960, 640, Phaser.AUTO);

	//define states
	// more will be added later
	game.state.add('Boot', Boot);
	game.state.add('Load', Load);
	game.state.add('MainMenu', MainMenu);
	game.state.add('BossLevel', BossLevel);
	game.state.add('GameOver', GameOver);

	// start game
	game.state.start('Boot');

}


