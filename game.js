var game;

window.onload = function () {
  game = new Phaser.Game(1366, 768, Phaser.AUTO, 'game');

  var PhaserGame = function () {
    this.sprite = null;
    this.player = null;
    this.cursors = null;
    this.jumpButton = null;
    this.yAxis = p2.vec2.fromValues(0, 1);

    this.segmentList = null;
    this.obstacleList = null;
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
      this.load.image('atari', 'assets/demo/block.png');
      this.load.image('background', 'assets/demo/sky.png');
      this.load.spritesheet('player', 'assets/demo/dude.png', 32, 48);
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
      var phy = this.physics.p2;

      phy.gravity.y = 350;
      phy.world.defaultContactMaterial.friction = 0.3;
      phy.world.setGlobalStiffness(1e5);

      // Load data
      this.parseDataLists('data');

      // Build level
      this.buildLevel();

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
      game.input.onDown.add(this.toggleFullScreen, this);
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

    updateCameraBounds: function(player) {
      if(player.x > (game.camera.x + game.camera.width)) {
        game.add.tween(game.camera).to({ x: game.camera.x + game.camera.width }, 500, Phaser.Easing.Linear.None, true);
      }

      if(player.x < (game.camera.x)) {
        if(game.camera.x > 0) {
            game.add.tween(game.camera).to({ x: game.camera.x - game.camera.width }, 500, Phaser.Easing.Linear.None, true);
        }
      }

      var halfCameraHeight = game.camera.height / 2;
      if(player.y > halfCameraHeight) {
        game.camera.y = player.y - halfCameraHeight;
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
    /**
     * Debuggage
     */
    dump: function() {
      // console.log(this.pad1._axes[0]);
      // console.log(this.pad1._rawPad.axes[0]);
    }
  };

  game.state.add('Game', PhaserGame, true);
};