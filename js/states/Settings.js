//Settings state

var Settings = function(game) {};
Settings.prototype = {
  init: function(main, alt, music_vol, sfx_vol){
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
        console.log(this.music_vol + " " + this.sfx_vol);

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
    this.music_down = game.add.button(game.width/5 + 100, game.height/4 - 20, "button dark", this.vol_change, this);
    this.sfx_down = game.add.button(game.width/5 + 100, game.height/4 + 30, "button dark", this.vol_change, this);
    this.music_up = game.add.button(game.width/5 + 300, game.height/4 - 20, "button dark", this.vol_change, this);
    this.sfx_up = game.add.button(game.width/5 + 300, game.height/4 + 30, "button dark", this.vol_change, this);

    //set up the buttons for hotkeys
    this.main_up = game.add.button(game.width/5 + 100, game.height/2, "button dark", this.begin_capture, this);
    this.alt_up = game.add.button(game.width/5 + 230, game.height/2, "button dark", this.begin_capture, this);
    this.main_down = game.add.button(game.width/5 + 100, game.height/2 + 50, "button dark", this.begin_capture, this);
    this.alt_down = game.add.button(game.width/5 + 230, game.height/2 + 50, "button dark", this.begin_capture, this);
    this.main_left = game.add.button(game.width/5 + 100, game.height/2 + 100, "button dark", this.begin_capture, this);
    this.alt_left = game.add.button(game.width/5 + 230, game.height/2 + 100, "button dark", this.begin_capture, this);
    this.main_right = game.add.button(game.width/5 + 100, game.height/2 + 150, "button dark", this.begin_capture, this);
    this.alt_right = game.add.button(game.width/5 + 230, game.height/2 + 150, "button dark", this.begin_capture, this);
    this.main_fire = game.add.button(game.width/5 + 100, game.height/2 + 200, "button dark", this.begin_capture, this);
    this.alt_fire = game.add.button(game.width/5 + 230, game.height/2 + 200, "button dark", this.begin_capture, this);

    //set up all the dynamic text
    // this.dynamic_text = game.add.group();

    this.music_vol_text = game.add.bitmapText(game.width/5 + 265, game.height/4 + 5, "aldrich64", "10", 30);
    this.sfx_vol_text = game.add.bitmapText(game.width/5 + 265, game.height/4 + 55, "aldrich64", "10", 30);

    this.main_up_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 25, "aldrich64", "UP", 30);
    this.alt_up_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 25, "aldrich64", "W", 30);
    this.main_down_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 75, "aldrich64", "DOWN", 30);
    this.alt_down_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 75, "aldrich64", "S", 30);
    this.main_left_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 125, "aldrich64", "LEFT", 30);
    this.alt_left_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 125, "aldrich64", "A", 30);
    this.main_right_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 175, "aldrich64", "RIGHT", 30);
    this.alt_right_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 175, "aldrich64", "D", 30);
    this.main_fire_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 225, "aldrich64", "SPACEBAR", 30);
    this.alt_fire_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 225, "aldrich64", "SPACEBAR", 30);

    //find a way to fix this mess
    this.music_vol_text.anchor.set(0.5);
    this.sfx_vol_text.anchor.set(0.5);
    this.main_up_text.anchor.set(0.5);
    this.alt_up_text.anchor.set(0.5);
    this.main_down_text.anchor.set(0.5);
    this.alt_down_text.anchor.set(0.5);
    this.main_left_text.anchor.set(0.5);
    this.alt_left_text.anchor.set(0.5);
    this.main_right_text.anchor.set(0.5);
    this.alt_right_text.anchor.set(0.5);
    this.main_fire_text.anchor.set(0.5);
    this.alt_fire_text.anchor.set(0.5);

    // this.dynamic_text.add(this.music_vol_text); 
    // this.dynamic_text.add(this.sfx_vol_text);
    // this.dynamic_text.add(this.main_up_text);
    // this.dynamic_text.add(this.alt_up_text);
    // this.dynamic_text.add(this.main_down_text);
    // this.dynamic_text.add(this.alt_down_text);
    // this.dynamic_text.add(this.main_left_text);
    // this.dynamic_text.add(this.alt_left_text);
    // this.dynamic_text.add(this.main_right_text);
    // this.dynamic_text.add(this.alt_right_text);
    // this.dynamic_text.add(this.main_fire_text);
    // this.dynamic_text.add(this.alt_fire_text);

    // this.dynamic_text.setAll("anchor.x", 0.5);
    // this.dynamic_text.setAll("anchor.y", 0.5);

    this.cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addCallbacks(this, null, null, this.capture);
    this.capturing = false;
    this.change_hotkey = null;
    this.change_hotekey_text = "";

  },
  update: function(){

    this.capture_special(); //the keyboard callback doesn't capture the arrow keys, which might be important

    if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
      game.input.keyboard.removeCallbacks(); //clear the key capturing callbacks
      game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
  },
  update_volume_text: function() {
    this.music_vol_text.text = "" + (10 * this.music_vol);
    this.sfx_vol_text.text = "" + (10 * this.sfx_vol);
  },
  update_hotkey_text: function(hotkey_text, keybind) {
    hotkey_text.text = keybind;
  },
  vol_change: function(button, pointer, isOver) {
    switch (button){
      case this.music_down:
          if(this.music_vol >= 0.1) this.music_vol -= 0.1;
          this.music_vol = Math.round(10*this.music_vol)/10;
          break;
      case this.music_up:
          if(this.music_vol <= 0.9) this.music_vol += 0.1;
          this.music_vol = Math.round(10*this.music_vol)/10;
          break;
      case this.sfx_down:
          if(this.sfx_vol >= 0.1) this.sfx_vol -= 0.1;
          this.sfx_vol = Math.round(10*this.sfx_vol)/10;          
          break;
      case this.sfx_up:
          if(this.sfx_vol <= 0.9) this.sfx_vol += 0.1;
          this.sfx_vol = Math.round(10*this.sfx_vol)/10;
          break;                  
      default:
        break;
      }
    console.log(this.music_vol + " " + this.sfx_vol);
    this.update_volume_text();

  },
  begin_capture: function(button, pointer, isOver) {
    var hotkey;
    if(!this.capturing) {
      switch (button){
        case this.main_up:
          this.change_hotkey = this.main.up;
          this.change_hotekey_text = this.main_up_text;
          this.update_hotkey_text(this.main_up_text, "");
          break;
        case this.main_down:
          break;
        case this.main_left:
          break;
        case this.main_right:
          break;  
        case this.alt_up:
          break;
        case this.alt_down:
          break;
        case this.alt_left:
          break;
        case this.alt_right:
          break;                  
        default:
          break;
      }
    this.capturing = true;

    }
  },
  capture: function(string, event) {
    if(this.capturing) {
      console.log(string);
      console.log(event);
      this.end_capture(this.change_hotkey, this.change_hotekey_text, keycode, string);
    }
  },
  capture_special: function() {
    if(this.capturing) {
      this.end_capture(this.change_hotkey, this.change_hotekey_text, keycode, string);
    }
  },
  end_capture: function(hotkey, text, keycode, string) {
    this.capturing = false;
    hotkey = keycode;
    this.update_hotkey_text(text, string);
  },
  reset_settings: function() {
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
  }
};