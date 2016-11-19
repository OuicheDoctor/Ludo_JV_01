window.onload = function () {
  var game = new Phaser.Game(1366, 768, Phaser.AUTO, 'game');

  var PhaserGame = function () {
    // init
    this.sprite = null;

    this.player = null;
    this.facing = 'left';
    this.jumpTimer = 0;
    this.cursors = null;
    this.jumpButton = null;
    this.yAxis = p2.vec2.fromValues(0, 1);
  };

  PhaserGame.prototype = {
    init: function () {
    },

    preload: function () {
      // this.load.baseURL = '';
      this.load.image('atari', 'assets/block.png');
      this.load.image('background', 'assets/background2.png');
      this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },

    create: function () {
      bg = this.add.tileSprite(0, 0, 800, 600, 'background');

      //  Enable p2 physics
      this.physics.startSystem(Phaser.Physics.P2JS);

      this.physics.p2.gravity.y = 350;
      this.physics.p2.world.defaultContactMaterial.friction = 0.3;
      this.physics.p2.world.setGlobalStiffness(1e5);

      //  Add a sprite
      this.player = this.add.sprite(200, 200, 'dude');
      this.player.animations.add('left', [0, 1, 2, 3], 10, true);
      this.player.animations.add('turn', [4], 20, true);
      this.player.animations.add('right', [5, 6, 7, 8], 10, true);

      //  Enable if for physics. This creates a default rectangular body.
      this.physics.p2.enable(this.player);

      this.player.body.fixedRotation = true;
      this.player.body.damping = 0.5;

      var spriteMaterial = this.physics.p2.createMaterial('spriteMaterial', this.player.body);
      var worldMaterial = this.physics.p2.createMaterial('worldMaterial');
      var boxMaterial = this.physics.p2.createMaterial('worldMaterial');

      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      this.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

      //  A stack of boxes - you'll stick to these
      for (var i = 1; i < 4; i++) {
        var box = this.add.sprite(300, 645 - (95 * i), 'atari');
        this.physics.p2.enable(box);
        box.body.mass = 6;
        // box.body.static = true;
        box.body.setMaterial(boxMaterial);
      }

      //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
      //  those 2 materials collide it uses the following settings.

      var groundPlayerCM = this.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, {friction: 0.0});
      var groundBoxesCM = this.physics.p2.createContactMaterial(worldMaterial, boxMaterial, {friction: 0.6});

      //  Here are some more options you can set:

      // contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
      // contactMaterial.restitution = 0.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
      // contactMaterial.stiffness = 1e3;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
      // contactMaterial.relaxation = 0;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
      // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
      // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
      // contactMaterial.surfaceVelocity = 0.0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

      text = this.add.text(20, 20, 'move with arrow, space to jump', {fill: '#ffffff'});

      this.cursors = this.input.keyboard.createCursorKeys();
      this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function () {
      if (this.cursors.left.isDown) {
        this.player.body.moveLeft(200);

        if (this.facing != 'left') {
          this.player.animations.play('left');
          this.facing = 'left';
        }
      }
      else if (this.cursors.right.isDown) {
        this.player.body.moveRight(200);

        if (this.facing != 'right') {
          this.player.animations.play('right');
          this.facing = 'right';
        }
      }
      else {
        this.player.body.velocity.x = 0;

        if (this.facing != 'idle') {
          this.player.animations.stop();

          if (this.facing == 'left') {
            this.player.frame = 0;
          }
          else {
            this.player.frame = 5;
          }

          this.facing = 'idle';
        }
      }

      if (this.jumpButton.isDown && game.time.now > this.jumpTimer && this.checkIfCanJump()) {
        this.player.body.moveUp(300);
        this.jumpTimer = game.time.now + 750;
      }


    },

    checkIfCanJump: function () {
      var result = false;

      for (var i = 0; i < this.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = this.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data) {
          var d = p2.vec2.dot(c.normalA, this.yAxis);

          if (c.bodyA === this.player.body.data) {
            d *= -1;
          }

          if (d > 0.5) {
            result = true;
          }
        }
      }
      return result;
    }
  };

  CustomSprite = function (game, x, y, key, group) {

    Phaser.Sprite.call(this, game, x, y, key);

    this.physics.p2.enable(this);

    // this.anchor.x = 0.5;

    // this.body.customSeparateX = true;
    // this.body.customSeparateY = true;
    // this.body.allowGravity = false;
    // this.body.immovable = true;
  };

  CustomSprite.prototype = Object.create(Phaser.Sprite.prototype);
  CustomSprite.prototype.constructor = CustomSprite;
  CustomSprite.prototype.someBehavior = function () {
  };

  game.state.add('Game', PhaserGame, true);
};
