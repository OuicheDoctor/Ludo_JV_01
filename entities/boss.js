var Boss = function (phaser, life) {
  // images
  this.image = undefined;

  // ref
  this.phaser = phaser;

  // stats
  this.attackRange = 0;
  this.life = life;
  this.aggroRange = 0;
  this.fly = false;
  this.move = true;
  this.alive = true;

  this.room = undefined;
};

Boss.prototype = Object.create(Phaser.Sprite.prototype);

Boss.prototype.initFight = function() {
  var leftWall = new p2.Body({ mass: 0, position: [ this.room.x, 0 ], angle: 1.5707963267948966 });
  leftWall.addShape(new p2.Plane());
  this.phaser.addBody(leftWall);
}

Boss.prototype.update = function() {
  if(this.alive && this.life <= 0)
    this.die();
}

Boss.prototype.takeDamage = function() {
  if(this.life <= 0)
    return;
  this.life -= 1;
};

Boss.prototype.die = function() {
  var currentY = this.y;
  this.body.velocity.x = 0;
  this.body.clearCollision();
  this.phaser.game.add.tween(this.body).to({ y: currentY - 100 }, 500, Phaser.Easing.Quadratic.InOut, true, 0, 0, true);
  this.phaser.game.add.tween(this.body).to({ angle: 360 }, 500, Phaser.Easing.Linear.None, true, 0, -1, false);

  this.alive = false;
};

Boss.prototype.deploy = function(phaser, x, y, bossRoom) {
  Phaser.Sprite.call(this, phaser.game, x, y, this.image);
  phaser.game.physics.p2.enable(this);
  this.body.setCollisionGroup(phaser.groups.enemyCollisionGroup);
  this.body.collides(phaser.groups.playerCollisionGroup);

  phaser.game.world.add(this);
  this.room = bossRoom;
  this.phaser = phaser;
}