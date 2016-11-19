Player = function (phaser) {
  Phaser.Sprite.call(this, phaser.game, 200, 200, 'player');

  this.phaser = phaser;
  this.facing = 'left';
  this.animations.add('left', [0, 1, 2, 3], 10, true);
  this.animations.add('turn', [4], 20, true);
  this.animations.add('right', [5, 6, 7, 8], 10, true);

  //  Enable if for physics. This creates a default rectangular body.
  phaser.game.physics.p2.enable(this);

  // Faire en sorte que le perso garde les pieds sur terre
  this.body.fixedRotation = true;
  // Facteur d'amortissement (perte de velocité / seconde)
  // Ici 0.5 veut dire qu'on perd la moitié de la vélocité / seconde
  this.body.damping = 0.5;

  // See addShape, removeShape, clearShapes to add extra shapes around the Body.
  phaser.game.world.add(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
  var cursors = this.phaser.cursors;
  if (cursors.left.isDown) {
    this.body.moveLeft(200);
    if (this.facing != 'left') {
      this.animations.play('left');
      this.facing = 'left';
    }
  }
  else if (cursors.right.isDown) {
    this.body.moveRight(200);

    if (this.facing != 'right') {
      this.animations.play('right');
      this.facing = 'right';
    }
  }
  else {
    this.body.velocity.x = 0;

    if (this.facing != 'idle') {
      this.animations.stop();

      if (this.facing == 'left') {
        this.frame = 0;
      }
      else {
        this.frame = 5;
      }

      this.facing = 'idle';
    }
  }

  if (this.phaser.jumpButton.isDown && this.canJump()) {
    this.body.moveUp(300);
  }
};

Player.prototype.canJump = function () {
  return Math.abs(this.body.velocity.y) < 1;
};

Player.prototype.onHitBox = function (bodyPlayer, bodyBox) {
  console.log("onHitBox");
  // bodyBox.velocity.x = 300;
};