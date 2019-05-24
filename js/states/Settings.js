//Settings state

var Settings = function(game) {};
Settings.prototype = {
  init: function(main, alt){
    this.main = main;
    this.alt = alt;
  },
  preload: function() {
    //all preloading done in Load state
  },
  create: function(){

    game.sound.stopAll();
    game.add.image(0, 0, "background");
    

    //set up all the labels
    game.add.bitmapText(game.width/5 - 15, game.height/8 - 50, "aldrich64", "Settings", 48);
    game.add.bitmapText(game.width/5, game.height/4 - 65, "aldrich64", "Volume", 32);
    game.add.bitmapText(game.width/5 + 15, game.height/4 - 10, "aldrich64", "Music", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/4 + 45, "aldrich64", "SFX", 24);
    game.add.bitmapText(game.width/5, game.height/3 + 40, "aldrich64", "Hotkeys", 32);
    game.add.bitmapText(game.width/5 + 150, game.height/3 + 78, "aldrich64", "Main", 20);
    game.add.bitmapText(game.width/5 + 260, game.height/3 + 78, "aldrich64", "Alternate", 20);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 15, "aldrich64", "Up", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 65, "aldrich64", "Down", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 115, "aldrich64", "Left", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 165, "aldrich64", "Right", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 215, "aldrich64", "Fire", 24);

    game.add.bitmapText(3*game.width/4 - 15, game.height/2 + 40, "aldrich64", "Click a button\nto change the hotkey", 24);
    game.add.bitmapText(3*game.width/4 - 15, game.height/2 + 150, "aldrich64", "note to self\n insert a reset \nto default button", 24);

    game.add.bitmapText(game.width/3, 7*game.height/8 + 25, "aldrich64", 'Press ESC to return to menu', 30);


    //set up the buttons for volume
    this.music_down = game.add.button(game.width/5 + 100, game.height/4 - 20, "button dark", this.capture, this);
    this.sfx_down = game.add.button(game.width/5 + 100, game.height/4 + 30, "button dark", this.capture, this);
    this.music_up = game.add.button(game.width/5 + 300, game.height/4 - 20, "button dark", this.capture, this);
    this.sfx_up = game.add.button(game.width/5 + 300, game.height/4 + 30, "button dark", this.capture, this);

    //set up the buttons for hotkeys
    this.main_up = game.add.button(game.width/5 + 100, game.height/2, "button dark", this.capture, this);
    this.alt_up = game.add.button(game.width/5 + 230, game.height/2, "button dark", this.capture, this);
    this.main_down = game.add.button(game.width/5 + 100, game.height/2 + 50, "button dark", this.capture, this);
    this.alt_down = game.add.button(game.width/5 + 230, game.height/2 + 50, "button dark", this.capture, this);
    this.main_left = game.add.button(game.width/5 + 100, game.height/2 + 100, "button dark", this.capture, this);
    this.alt_left = game.add.button(game.width/5 + 230, game.height/2 + 100, "button dark", this.capture, this);
    this.main_right = game.add.button(game.width/5 + 100, game.height/2 + 150, "button dark", this.capture, this);
    this.alt_right = game.add.button(game.width/5 + 230, game.height/2 + 150, "button dark", this.capture, this);
    this.main_fire = game.add.button(game.width/5 + 100, game.height/2 + 200, "button dark", this.capture, this);
    this.alt_fire = game.add.button(game.width/5 + 230, game.height/2 + 200, "button dark", this.capture, this);

    //set up all the dynamic text
    this.music_vol = game.add.bitmapText(game.width/5 + 250, game.height/4 - 10, "aldrich64", "100", 30);
    this.sfx_vol = game.add.bitmapText(game.width/5 + 250, game.height/4 + 40, "aldrich64", "100", 30);



    game.input.keyboard.addCallbacks(this, null, null, this.capture);




  },
  update: function(){


    if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
      game.input.keyboard.removeCallbacks(); //clear the key capturing
      game.state.start('MainMenu', true, false, this.main, this.alt);

    }
  },
  capture: function(string, event) {
    console.log(string);
    console.log(event);
  }
};