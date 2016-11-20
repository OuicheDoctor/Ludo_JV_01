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

    this.segmentList = null;
    this.obstacleList = null;
  };

  PhaserGame.prototype = {
    init: function () {
    },

    preload: function () {
      // this.load.baseURL = '';
      this.load.image('atari', 'assets/demo/block.png');
      this.load.image('background', 'assets/demo/sky.png');
      this.load.spritesheet('dude', 'assets/demo/dude.png', 32, 48);
      this.load.json('data', 'data/datalists.json');

      // Segments
      this.load.json('segment_1_data', 'data/segments/segment_1.json');
      this.load.json('segment_2_data', 'data/segments/segment_2.json');
      this.load.json('segment_3_data', 'data/segments/segment_3.json');

      // Elements
      this.load.image('platform_1_fg', 'assets/elements/platform_1_fg.png');
      this.load.image('platform_1_bg', 'assets/elements/platform_1_bg.png');
    },

    create: function () {

      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.camera.setSize(1366, 768);
      //  Enable p2 physics
      this.physics.startSystem(Phaser.Physics.P2JS);

      this.physics.p2.gravity.y = 350;
      this.physics.p2.world.defaultContactMaterial.friction = 0.3;
      this.physics.p2.world.setGlobalStiffness(1e5);

      // Load data
      this.parseDataLists('data');

      // Build level
      this.buildLevel();

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

      game.input.onDown.add(this.toggleFullScreen, this);
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

      this.updateCameraBounds(this.player);

    },

    toggleFullScreen: function () {
      if(!game.scale.isFullScreen) {
        this.game.scale.startFullScreen(false);
      }
      else
      {
        this.game.scale.stopFullScreen();
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
    },

    buildLevel: function () {
      var sList = this.segmentList;
      var segment = null;

      // Pick 3 random segments
      for (var i = 0; i < 3; i++) {
        segment = Phaser.ArrayUtils.removeRandomItem(this.segmentList);
        if(segment == undefined)
          break;
        segment.addToGame(this, i);
      }
    },

    parseDataLists: function(key) {
      var data = this.cache.getJSON(key);

      var sList = new Array();
      var current;

      // Load segments data
      data.Segments.forEach(function (seg) {
        sList.push(new Segment(seg.ID, 'background'));
      });
      this.segmentList = sList;

      // Load obstacles types data
      sList = new Array();
      data.Obstacles.forEach(function (obs)  {
        current = new Platform();
        current.setForeground(obs.RelativeX, obs.RelativeY, "platform_" + obs.ID + "_fg");
        current.setBackground("platform_" + obs.ID + "_bg");
        sList[obs.ID] = current;
      });
      this.obstacleList = sList;
    },

    updateCameraBounds: function(player) {
      if(player.x > (game.camera.x + game.camera.width)) {
        /*game.camera.x += game.camera.width;*/
        game.add.tween(game.camera).to({ x: game.camera.x + game.camera.width }, 500, Phaser.Easing.Linear.None, true);
      }

      if(player.x < (game.camera.x)) {
        if(game.camera.x > 0) {
          game.add.tween(game.camera).to({ x: game.camera.x - game.camera.width }, 500, Phaser.Easing.Linear.None, true);
          /*game.camera.x -= game.camera.width;*/
        }
      }

      var halfCameraHeight = game.camera.height / 2;
      if(player.y > halfCameraHeight) {
        game.camera.y = player.y - halfCameraHeight;
      }
    }
  };

  CustomSprite = function (game, x, y, key, group) {

    Phaser.Sprite.call(this, game, x, y, key);

    this.physics.p2.enable(this);
  };

  CustomSprite.prototype = Object.create(Phaser.Sprite.prototype);
  CustomSprite.prototype.constructor = CustomSprite;
  CustomSprite.prototype.someBehavior = function () {
  };

  game.state.add('Game', PhaserGame, true);
};
