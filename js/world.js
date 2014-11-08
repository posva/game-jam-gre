define(['phaser', 'selfish', 'lodash'], function(__phaser, selfish, _) {
  var Base = selfish.Base;
  var World = Base.extend({
    initiliaze: function(game) {
      game.physics.startSystem(Phaser.Physics.NINJA);
      this.game = game;
      this.sprite = game.add.sprite(50, 50, 'player');
    },
    update: function() {
    },
  });
  return World;
});
