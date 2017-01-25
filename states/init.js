InitState = function () {}
InitState.prototype = Object.create(Phaser.State.prototype);

InitState.prototype.init = function() {
  if(data.debug.state)
    console.log("INIT STATE : init");
}

InitState.prototype.preload = function() {
  if(data.debug.state)
    console.log("INIT STATE : preload");

  // Preload menu bkg
  game.load.image('menu_bkg', 'assets/ui/menu_bkg.png');

  // Preload generic data
  this.load.json('data', 'data/datalists.json');

  // Preload segments files
  for(var segment_index = 1; segment_index <= data.segmentTotalCount; segment_index++)
    this.load.json('segment_' + segment_index + '_data', 'data/segments/segment_' + segment_index + '.json');

  // Segments
  this.load.image('segment_bkg_1', 'assets/levels/sky.png');
  this.load.image('segment_bkg_2', 'assets/levels/sky.png');
  this.load.image('segment_bkg_3', 'assets/levels/sky.png');

  // Elements
  this.load.image('element_1_fg', 'assets/elements/element_1_fg.png');
  this.load.image('element_2_bg', 'assets/elements/element_2_bg.png');
  this.load.image('element_2_fg', 'assets/elements/element_2_fg.png');
  this.load.image('element_3_fg', 'assets/elements/element_3_fg.png');
  this.load.image('element_4_fg', 'assets/elements/element_4_fg.png');
  this.load.image('element_5_fg', 'assets/elements/element_5_fg.png');
  this.load.image('element_6_bg', 'assets/elements/element_6_bg.png');
  this.load.image('element_7_fg', 'assets/elements/element_7_fg.png');
  this.load.image('element_8_fg', 'assets/elements/element_8_fg.png');
  this.load.image('element_9_fg', 'assets/elements/element_9_fg.png');
  this.load.image('element_10_fg', 'assets/elements/element_10_fg.png');
  this.load.image('element_11_fg', 'assets/elements/element_11_fg.png');
  this.load.image('element_12_bg', 'assets/elements/element_12_bg.png');
  this.load.image('element_12_fg', 'assets/elements/element_12_fg.png');
  this.load.image('element_13_bg', 'assets/elements/element_13_bg.png');
}

InitState.prototype.create = function() {
  if(data.debug.state)
    console.log("INIT STATE : create");

  this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  // Add menu background
  var background = game.add.image(0, 0, 'menu_bkg');
  background.width = this.scale.width;
  background.height = this.scale.height;

  // Draw text
  var textStyle = {
    boundsAlignH: "center",
    boundsAlignV: "middle",
    font: "bold 24px Arial",
    fill: "#fff"
  };
  var instrStyle = {
    boundsAlignH: "center",
    boundsAlignV: "middle",
    font: "bold 16px Arial",
    fill: "#fff"
  };

  text = game.add.text(0, 0, "Press START to play !", textStyle);
  text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  text.setTextBounds(0, game.height / 2 - 25, game.width, 50);

  instr = game.add.text(0, 0, "T to (T)oggle fullscreen", instrStyle);
  instr.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  instr.setTextBounds(0, game.height / 2 + 25, game.width, 50);

  // Parse data
  var parsedData = game.cache.getJSON('data');

  // Process segments data
  data.segments = [];
  parsedData.Segments.forEach(function (seg) {
    data.segments[seg.ID] = seg;
  });

  // Process obstacles data
  data.obstacles = [];
  parsedData.Elements.forEach(function (obs)  {
    data.obstacles[obs.id] = obs;
  });

  // Create game groups
  data.groups = {};
  data.groups.segments = new Phaser.Group(game, null, 'segments', true);
  data.groups.obstacles = new Phaser.Group(game, null, 'obstacles', true);

  // Bind fullscreen
  game.input.onDown.add(this.gofull, this);
}

InitState.prototype.update = function() {
  if(data.debug.state)
    console.log("INIT STATE : update");

  data.pad = game.input.gamepad.pad1;
  if(data.pad.isDown(Phaser.Gamepad.XBOX360_START) || game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
    game.state.start('in_game', true);
  }
}

InitState.prototype.gofull = function() {
  if (game.scale.isFullScreen) {
      game.scale.stopFullScreen();
  }
  else {
    game.scale.startFullScreen(false);
  }
}