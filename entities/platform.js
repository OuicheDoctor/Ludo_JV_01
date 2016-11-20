var Platform = function () {
    // images
    this.fg = undefined;
    this.bg = undefined;

    // relative position
    this.relativeX = undefined;
    this.relativeY = undefined;

    // is the element dangerous on contact
    this.danger = false;

    // is the element moving ?
    this.deltaX = 0;
    this.deltaY = 0;

    this.tween = undefined;
  };

  Platform.prototype = {

    setForeground : function(relativeX, relativeY, fgKey) {
      this.fg = fgKey;
      this.relativeX = relativeX;
      if(this.relativeX == "")
        this.relativeX = 0;
      this.relativeY = relativeY;
      if(this.relativeY == "")
        this.relativeY = 0;
    },

    setBackground : function(bgKey) {
      this.bg = bgKey;
    },

    setDanger : function(isDanger) {
      this.danger = isDanger;
    },
    
    setDeltaMove : function(deltaX, deltaY) {
      this.deltaX = deltaX;
      this.deltaY = deltaY;
    },

    deploy : function(instance, x, y) {
      if(this.bg !== undefined)
        instance.game.add.image(x, y, this.bg);

      if(this.fg !== undefined) {
        var sprite = instance.game.add.sprite(x + this.relativeX, y + this.relativeY, this.fg);
        sprite.x = sprite.x + sprite.width / 2;
        sprite.y = sprite.y + sprite.height / 2;
        instance.physics.p2.enable(sprite);
        sprite.body.kinematic = true;
        sprite.body.setCollisionGroup(instance.groups.boxCollisionGroup);
        if(this.danger) {
          sprite.body.collides
          (instance.groups.playerCollisionGroup, function(my, other) {
            if(other.sprite == this.player) {
              console.log("blarg, you're dead !");
            }
          }, instance);
        }
        else {
          sprite.body.collides(instance.groups.playerCollisionGroup);
        }

        if(this.deltaX > 0 || this.deltaY > 0) {
          var toX = sprite.x + this.deltaX;
          var toY = sprite.y + this.deltaY;
          this.tween = instance.game.add.tween(sprite.body).to({ x: toX, y: toY }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
        }

      }
    }

  };