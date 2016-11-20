var Platform = function () {
    // images
    this.fg = null;
    this.bkg = null;

    // relative position
    this.relativeX = 0;
    this.relativeY = 0;
  };

  Platform.prototype = {

    setForeground : function(relativeX, relativeY, fgKey) {
      this.fg = fgKey;
      this.relativeX = relativeX;
      this.relativeY = relativeY;
    },

    setBackground : function(bgKey) {
      this.bg = bgKey;
    },
    
    deploy : function(instance, x, y) {
      instance.game.add.image(x, y, this.bg);
      var sprite = instance.game.add.sprite(x + this.relativeX, y + this.relativeY, this.fg);
      instance.physics.p2.enable(sprite);
      sprite.body.kinematic = true;
    }

  };