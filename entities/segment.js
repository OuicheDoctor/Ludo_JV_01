var Segment = function (id, bkg, y = 0) {
    // init
    this.id = id;
    this.bkg = bkg;
    this.x = null;
    this.y = y;
  };

  Segment.prototype = {
    addToGame : function(instance, index) {
      var x = 0;
      var game = instance.game;
      if(index > 0)
          x = game.world.width;
      this.x = x;
      var bkgSprite = game.add.sprite(x, this.y, this.bkg);
      this.buildContent(instance);
      game.world.resize(x + bkgSprite.width, Math.max(game.world.height, bkgSprite.height));
    },

    buildContent : function(instance) {
      var data = instance.cache.getJSON("segment_" + this.id + "_data");

      // Load obstacles
      var current;
      var segment = this;
      data.Obstacles.forEach(function (seg) {
          current = instance.obstacleList[seg.ID];
          current.deploy(instance, segment.x + seg.X, segment.y + seg.Y);
      });
    }
  };