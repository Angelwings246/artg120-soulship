/* Soul Ship (Working Title)
* by Hunter Lynch, Angel Tan, Taylor Fagundes
* First Prototype Build: 5/13/19
* First Tutorial Build: 5/15/19
* GitHub repository: https://github.com/Angelwings246/artg120-soulship
* Enjoy!
*/

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
	game.state.add('Settings', Settings);
	game.state.add('Credits', Credits);
	game.state.add('Cutscene1', Cutscene1);
	game.state.add('Tutorial', Tutorial);
	game.state.add('TutorialPt1', TutorialPt1);
	game.state.add('Cutscene2', Cutscene2);
	game.state.add('TutorialPt2', TutorialPt2);
	game.state.add('Level1', Level1);
	game.state.add('BossLevel', BossLevel);
	game.state.add('GameOver', GameOver);

	// start game
	game.state.start('Boot');

}


