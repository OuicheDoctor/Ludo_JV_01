var Segment = function (bkg, y = 0) {
    // init
    this.bkg = bkg;
    this.y = y;
  };

  Segment.prototype = {
    addToGame : function(game, index) {
        var x = 0
        if(index > 0)
            x = game.world.width 
        var bkgSprite = game.add.sprite(x, this.y, this.bkg);
        game.world.resize(x + bkgSprite.width, Math.max(game.world.height, bkgSprite.height));
    }
  };