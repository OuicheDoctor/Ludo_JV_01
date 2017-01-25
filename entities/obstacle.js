var Obstacle = function (obstacle_id, x, y) {
  this.id = obstacle_id;
  Phaser.Sprite.call(this, game, x, y, 'element_' + this.id + '_bg');

  // Get obstacle data
  var obsData = data.obstacles[this.id];

  // Apply data
  this.width = obsData.width;
  this.height = obsData.height;
}
Obstacle.prototype = Object.create(Phaser.Sprite.prototype);

Obstacle.ObstaclesTypeEnum = {
    OBSTACLE        : 1,
    ACCROCHE        : 2,
    DECORS          : 3,
    PIEGE           : 4,
    MOVING_PLATFORM : 5
  };

Obstacle.prototype.update = function () {

}