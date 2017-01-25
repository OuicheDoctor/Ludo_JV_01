var game;
var data = {
  'debug' : {
    'state' : false,
  },
  'segmentTotalCount' : 3,
  'segmentByLevel' : 3,
};

window.onload = function() {
  game = new Phaser.Game(380, 216, Phaser.AUTO, 'game', new InitState());
  game.state.add('in_game', new InGameState());
}