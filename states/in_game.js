InGameState = function () {}
InGameState.prototype = Object.create(Phaser.State.prototype);

InGameState.prototype.init = function() {
  if(data.debug.state)
    console.log("IN GAME STATE : init");

  // Generate level here
  this.segments = [];
  for(var i = 0; i < data.segmentByLevel; i++) {
    this.segments[i] = new Segment();
  }
}

InGameState.prototype.preload = function() {
  if(data.debug.state)
    console.log("IN GAME STATE : preload");

  // Load required assets here
}

InGameState.prototype.create = function() {
  if(data.debug.state)
    console.log("IN GAME STATE : create");

  //  Enable p2 physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  var phy = game.physics.p2;
  phy.gravity.y = 350;
  phy.world.defaultContactMaterial.friction = 0.3;
  phy.world.setGlobalStiffness(1e5);
  //  Turn on impact events for the world, without this we get no collision callbacks
  phy.setImpactEvents(true);

  // Construct level here
  var x = 0;
  var y = 0;
  this.segments.forEach(function(seg) {
    seg.deploy(x, y);
    x += seg.width;
  });

  // Bind fullscreen
  game.input.onDown.add(this.gofull, this);
}

InGameState.prototype.update = function() {
  if(data.debug.state)
    console.log("IN GAME STATE : update");

  // Checks for the current level
}

InGameState.prototype.gofull = function() {
  if (game.scale.isFullScreen) {
      game.scale.stopFullScreen();
  }
  else {
    game.scale.startFullScreen(false);
  }
}