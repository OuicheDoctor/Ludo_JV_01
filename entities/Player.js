Player = function (phaser) {
  Phaser.Sprite.call(this, phaser.game, 200, 200, 'dude');

  var self = this;
  this.phaser = phaser;
  this.facing = 'left';
  this.dashing = false;
  this.jumping = false;
  this.onGround = true;
  this.dashedInJump = false;
  this.dashVelocity = 1000;
  this.moveVelocity = 200;

  // this.animations.add('estoc', [1], 10);
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

  this.tweens = {
    // dashRight: phaser.game.add.tween(self.body).to({x: '+200'}, 100, Phaser.Easing.Linear.None),
    // dashLeft: phaser.game.add.tween(self.body).to({x: '-200'}, 100, Phaser.Easing.Linear.None)
  };

  // See addShape, removeShape, clearShapes to add extra shapes around the Body.
  phaser.game.world.add(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function () {
  var cursors = this.phaser.cursors;
  var pad1 = this.phaser.input.gamepad.pad1;
  var cursorIsLeft = pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 || cursors.left.isDown;
  var cursorIsRight = pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 || cursors.right.isDown;
  var currentX = this.body.x;
  var self = this;

  if (Math.abs(this.body.velocity.y) < 1) {
    this.jumping = false;
    this.dashedInJump = false;
  }

  if (cursorIsLeft) {
    this.body.moveLeft(this.moveVelocity);
    if (this.facing != 'left') {
      this.animations.play('left');
      this.facing = 'left';
    }
  }
  else if (cursorIsRight) {
    this.body.moveRight(this.moveVelocity);

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

  // Jump
  if ((this.phaser.jumpButton.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_A)) && this.canJump()) {
    this.jumping = true;
    this.body.moveUp(300);
  }

  // Dash
  if ((this.phaser.dashButton.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_X, 200)) && !this.dashedInJump) {
    this.dashing = true;
    if(this.facing == 'right') {
      this.body.moveRight(this.dashVelocity);
    } else if(this.facing == 'left') {
      this.body.moveLeft(this.dashVelocity);
    }
  } else {
    this.dashing = false;
  }

  // Debug
  if (pad1.justPressed(Phaser.Gamepad.XBOX360_Y, 10)) {
    console.debug("Player body ", this.body);
  }

  // Gamepad Controls
  if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
  {
    // sprite.y--;
  }
  else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
  {
    // sprite.y++;
  }

  // Axis mouvement
  if (pad1.connected)
  {
    var rightStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
    var rightStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

    if (rightStickX)
    {
      this.x += rightStickX * 10;
    }

    if (rightStickY)
    {
      // this.y += rightStickY * 10;
    }
  }

  this.phaser.updateCameraBounds(this);
};

Player.prototype.canJump = function () {
  return !this.jumping;
};

Player.prototype.canDash = function () {
  return !this.dashing;
};

Player.prototype.onHitBox = function (bodyPlayer, bodyBox) {
  console.log("onHitBox");
  // bodyBox.velocity.x = 300;
};