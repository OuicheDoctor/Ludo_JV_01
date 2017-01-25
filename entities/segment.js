var Segment = function () {
  // Pick random segment
  this.id = game.rnd.integerInRange(1, data.segmentTotalCount);

  Phaser.Sprite.call(this, game, 0, 0, 'segment_bkg_' + this.id);
}
Segment.prototype = Object.create(Phaser.Sprite.prototype);

Segment.prototype.deploy = function (x, y) {
  // Get segment data
  var segData = data.segments[this.id];
  this.width = segData.Width;
  this.height = segData.Height;

  // Add segment to game;
  this.x = x;
  this.y = y + game.height - this.height;
  if(game.scale.isFullScreen)
    this.scale.setTo(game.scale.scaleFactor.x, game.scale.scaleFactor.y);
  data.groups.segments.add(this);

  // Get segment composition
  var composition = game.cache.getJSON("segment_" + this.id + "_data");
  composition.Obstacles.forEach(function (obs) {
    var obs = new Obstacle(obs.ID, obs.X, obs.Y)
    if(this.scale.isFullScreen)
      obs.scale.setTo(game.scale.scaleFactor.x, game.scale.scaleFactor.y);
    this.addChild(obs);
    data.groups.obstacles.add(obs);
  }, this);
}

Segment.prototype.update = function () {

}