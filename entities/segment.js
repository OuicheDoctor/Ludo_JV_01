var Segment = function (id, bkg) {
  // init
  this.id = id;
  this.bkg = bkg;
  this.phaser = undefined;
};

Segment.prototype = Object.create(Phaser.Sprite.prototype);

Segment.prototype.addToGame = function(instance, first = false) {
  var x = 0;
  var game = instance.game;
  if(!first)
      x = game.world.width
  Phaser.Sprite.call(this, game, x, 0, this.bkg);
  instance.game.world.add(this);
  this.buildContent(instance);
  game.world.resize(x + this.width, Math.max(game.world.height, this.height));
  this.phaser = instance;
};

Segment.prototype.buildContent = function(instance) {
  var data = instance.cache.getJSON("segment_" + this.id + "_data");

  // Load obstacles
  var current;
  var segment = this;
  data.Obstacles.forEach(function (seg) {
    current = instance.obstacleList[seg.ID];
    current.deploy(instance, segment.x + seg.X, segment.y + seg.Y);
  });

  data.Boss.forEach(function (seg) {
    current = instance.bossList[seg.ID];
    current.deploy(instance, segment.x + seg.X, segment.y + seg.Y, this);
  });
};

Segment.prototype.update = function() {

  var player = this.phaser.player;
  if((player.x > this.x && player.x < this.x + this.width)
    && (player.y > this.y && player.y < this.y + this.height)) {

  }

}