var game;

window.onload = function () {
  game = new Phaser.Game(1366, 768, Phaser.AUTO, 'game');

  var PhaserGame = function () {
    this.sprite = null;
    this.player = null;
    this.cursors = null;
    this.jumpButton = null;
    this.yAxis = p2.vec2.fromValues(0, 1);
    this.groups = {};
  };

  PhaserGame.prototype = {
    init: function () {
      // Controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      // Gamepad
      this.input.gamepad.start();

      // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
      pad1 = this.input.gamepad.pad1;
      this.input.gamepad.addCallbacks(this, {
        onConnect: function (e) {
          console.log("onConnectCallback", e);
        },
        onDisconnect: function (e) {
          console.log("onDisconnectCallback", e);
        },
        onDown: function (e) {
        },
        onUp: function (e) {
        },
        onAxis: function (e) {
        },
        onFloat: function (e) {
        }
      });
    },

    preload: function () {
      // this.load.baseURL = '';
      this.load.image('atari', 'assets/block.png');
      this.load.image('background', 'assets/background2.png');
      this.load.spritesheet('player', 'assets/dude.png', 32, 48);
    },

    create: function () {
      bg = this.add.tileSprite(0, 0, 800, 600, 'background');

      //  Enable p2 physics
      this.physics.startSystem(Phaser.Physics.P2JS);
      var phy = this.physics.p2;

      phy.gravity.y = 350;
      phy.world.defaultContactMaterial.friction = 0.3;
      phy.world.setGlobalStiffness(1e5);

      // Créer une collision avec un autre sprite
      // this.player.body.createBodyCallback(panda, hitPanda, this);

      //  Turn on impact events for the world, without this we get no collision callbacks
      phy.setImpactEvents(true);

      //  Player
      this.player = new Player(this);

      var spriteMaterial = phy.createMaterial('spriteMaterial', this.player.body);
      var worldMaterial = phy.createMaterial('worldMaterial');
      var boxMaterial = phy.createMaterial('boxMaterial');

      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      phy.setWorldMaterial(worldMaterial, true, true, true, true);

      // Groups
      // Create our collision groups. One for the player, one for the pandas
      var playerCollisionGroup = phy.createCollisionGroup();
      var boxCollisionGroup = phy.createCollisionGroup();

      // Obligatoire pour que les sprites ayant leurs propres "collisions groups" gardent la collision avec la scene
      // A faire après la création des "collisions groups"
      phy.updateBoundsCollisionGroup();

      var boxGroup = this.add.group();
      boxGroup.enableBody = true;
      boxGroup.physicsBodyType = Phaser.Physics.P2JS;

      //  A stack of boxGroup - you'll stick to these
      for (var i = 1; i < 4; i++) {
        var box = boxGroup.create(300, 645 - (95 * i), 'atari');
        box.body.mass = 6;
        box.body.setMaterial(boxMaterial);
        box.body.setCollisionGroup(boxCollisionGroup);
        box.body.collides([boxCollisionGroup, playerCollisionGroup]);
        // box.body.static = true;
      }

      this.player.body.setCollisionGroup(playerCollisionGroup);
      this.player.body.collides(boxCollisionGroup, this.player.onHitBox, this.player);

      this.game.camera.follow(this.player);

      //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
      //  those 2 materials collide it uses the following settings.
      var groundPlayerCM = phy.createContactMaterial(spriteMaterial, worldMaterial, {friction: 0.0});
      var groundBoxesCM = phy.createContactMaterial(worldMaterial, boxMaterial, {friction: 0.6});

      //  Here are some more options you can set:
      // contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
      // contactMaterial.restitution = 0.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
      // contactMaterial.stiffness = 1e3;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
      // contactMaterial.relaxation = 0;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
      // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
      // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
      // contactMaterial.surfaceVelocity = 0.0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

      text = this.add.text(20, 20, 'move with arrow, space to jump', {fill: '#ffffff'});
    },

    update: function () {
    },

    /**
     * Debuggage
     */
    dump: function() {
      // console.log(this.pad1._axes[0]);
      // console.log(this.pad1._rawPad.axes[0]);
    }

    // checkIfCanJumpWTF: function () {
    //   var result = false;
    //
    //   for (var i = 0; i < this.physics.p2.world.narrowphase.contactEquations.length; i++) {
    //     var c = this.physics.p2.world.narrowphase.contactEquations[i];
    //
    //     if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data) {
    //       var d = p2.vec2.dot(c.normalA, this.yAxis);
    //
    //       if (c.bodyA === this.player.body.data) {
    //         d *= -1;
    //       }
    //
    //       if (d > 0.5) {
    //         result = true;
    //       }
    //     }
    //   }
    //   return result;
    // }
  };

  game.state.add('Game', PhaserGame, true);
};