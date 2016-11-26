var game;

window.onload = function () {
  game = new Phaser.Game(380, 216, Phaser.AUTO, 'game');

  var PhaserGame = function () {
    this.sprite = null;
    this.player = null;
    this.cursors = null;
    this.jumpButton = null;
    this.yAxis = p2.vec2.fromValues(0, 1);

    this.bossSegmentList = null;
    this.segmentList = null;
    this.obstacleList = null;
    this.groups = {
        playerCollisionGroup : null,
        boxCollisionGroup : null,
        enemyCollisionGroup : null
    };
    this.bossList = null;
  };

  PhaserGame.ElementTypeEnum = {
    OBSTACLE        : 1,
    ACCROCHE        : 2,
    DECORS          : 3,
    PIEGE           : 4,
    MOVING_PLATFORM : 5
  };

  PhaserGame.BossEnum = {
    SOBEK : 1,
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
      this.load.image('background', 'assets/demo/sky.png');
      this.load.spritesheet('player', 'assets/demo/dude.png', 17, 25);
      this.load.spritesheet('sobek', 'assets/boss/sobek.png', 32, 32);
      this.load.json('data', 'data/datalists.json');

      // Segments
      this.load.json('segment_1_data', 'data/segments/segment_1.json');
      this.load.json('segment_2_data', 'data/segments/segment_2.json');
      this.load.json('segment_3_data', 'data/segments/segment_3.json');
      this.load.json('segment_4_data', 'data/segments/segment_4.json');

      // Elements
      this.load.image('element_1_fg', 'assets/elements/element_1_fg.png');
      this.load.image('element_2_bg', 'assets/elements/element_2_bg.png');
      this.load.image('element_2_fg', 'assets/elements/element_2_fg.png');
      this.load.image('element_3_fg', 'assets/elements/element_3_fg.png');
      this.load.image('element_4_fg', 'assets/elements/element_4_fg.png');
      this.load.image('element_5_fg', 'assets/elements/element_5_fg.png');
      this.load.image('element_6_bg', 'assets/elements/element_6_bg.png');
      this.load.image('element_7_fg', 'assets/elements/element_7_fg.png');
      this.load.image('element_8_fg', 'assets/elements/element_8_fg.png');
      this.load.image('element_9_fg', 'assets/elements/element_9_fg.png');
      this.load.image('element_10_fg', 'assets/elements/element_10_fg.png');
      this.load.image('element_11_fg', 'assets/elements/element_11_fg.png');
      this.load.image('element_12_bg', 'assets/elements/element_12_bg.png');
      this.load.image('element_12_fg', 'assets/elements/element_12_fg.png');
      this.load.image('element_13_bg', 'assets/elements/element_13_bg.png');

      // 
    },

    create: function () {

      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.camera.setSize(380, 216);
      //  Enable p2 physics
      this.physics.startSystem(Phaser.Physics.P2JS);
      var phy = this.physics.p2;

      phy.gravity.y = 350;
      phy.world.defaultContactMaterial.friction = 0.3;
      phy.world.setGlobalStiffness(1e5);

      //  Turn on impact events for the world, without this we get no collision callbacks
      phy.setImpactEvents(true);
      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      phy.setWorldMaterial(worldMaterial, true, true, true, true);

      // Groups
      // Create our collision groups. One for the player, one for the pandas
      this.groups.playerCollisionGroup = phy.createCollisionGroup();
      this.groups.boxCollisionGroup = phy.createCollisionGroup();
      this.groups.enemyCollisionGroup = phy.createCollisionGroup();

      // Load data
      this.parseDataLists('data');

      // Build level
      this.buildLevel();

      //  Player
      this.player = new Player(this);

      var spriteMaterial = phy.createMaterial('spriteMaterial', this.player.body);
      var worldMaterial = phy.createMaterial('worldMaterial');
      var boxMaterial = phy.createMaterial('boxMaterial');

      // Obligatoire pour que les sprites ayant leurs propres "collisions groups" gardent la collision avec la scene
      // A faire après la création des "collisions groups"
      phy.updateBoundsCollisionGroup();

      this.player.body.setCollisionGroup(this.groups.playerCollisionGroup);
      this.player.body.collides(this.groups.boxCollisionGroup, this.player.onHitBox, this.player);
      this.player.body.collides(this.groups.enemyCollisionGroup, this.player.onHitEnemy, this.player);

      //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
      //  those 2 materials collide it uses the following settings.
      var groundPlayerCM = phy.createContactMaterial(spriteMaterial, worldMaterial, {friction: 0.0});

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
        segment = Phaser.ArrayUtils.removeRandomItem(sList);
        if(segment == undefined)
          break;

        if(i == 0)
          segment.addToGame(this, true);
        else
          segment.addToGame(this);
      }

      sList = this.bossSegmentList;
      segment = Phaser.ArrayUtils.removeRandomItem(sList)
      if(segment !== undefined)
        segment.addToGame(this);
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
      var cache = this.cache;
      var data = cache.getJSON(key);

      var sList = new Array();
      var bList = new Array();
      var current;

      // Load segments data
      data.Segments.forEach(function (seg) {
        if(seg.Boss === 1)
          bList.push(new Segment(seg.ID, 'background'));
        else
          sList.push(new Segment(seg.ID, 'background'));
      });
      this.bossSegmentList = bList;
      this.segmentList = sList;

      // Load obstacles types data
      sList = new Array();
      var relativeY;
      data.Elements.forEach(function (obs)  {
        current = new Platform();
        // Handle moving_platform case;
        relativeX = obs.relativeX;
        relativeY = obs.relativeY;
        switch (obs.type) {
          case PhaserGame.ElementTypeEnum.MOVING_PLATFORM:
            current.setDeltaMove(relativeX[1], relativeY[1]);
            relativeX = relativeX[0];
            relativeY = relativeY[0];
            break;
          case PhaserGame.ElementTypeEnum.ACCROCHE:
            break;
          case PhaserGame.ElementTypeEnum.PIEGE:
            current.setDanger(true);
            break;
          case PhaserGame.ElementTypeEnum.OBSTACLE :
          case PhaserGame.ElementTypeEnum.DECORS :
          default:
            break;
        }

        var fg = "element_" + obs.id + "_fg";
        if(cache.checkImageKey(fg))
          current.setForeground(relativeX, relativeY, fg);

        var bg = "element_" + obs.id + "_bg";
        if(cache.checkImageKey(bg))
          current.setBackground(bg);

        sList[obs.id] = current;
      });
      this.obstacleList = sList;

      // Load bosses data
      sList = new Array();
      data.Boss.forEach(function (boss) {
        switch (boss.ID) {
          case PhaserGame.BossEnum.SOBEK:
            current = new Sobek(this, boss.Vie);
            sList[boss.ID] = current;
            break;
          default:
            break;
        }
      });
      this.bossList = sList; 

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