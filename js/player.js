define(['phaser', 'selfish', 'lodash'], function(__phaser, selfish, _) {
  var Base = selfish.Base;
  var Player = Base.extend({
    initialize: function(game) {
      this.sprite = game.add.sprite(50, 50, 'player');
      this.game = game;
      //this.sprite.body.bounce = 0.5;
      //game.physics.ninja.enableCircle(this.sprite, this.player.width / 2);
      this. group = game.physics.p2.createCollisionGroup();
      game.physics.p2.enable(this.sprite, true);
      this.sprite.body.setCircle(this.sprite.width/2);
      //this.sprite.body.fixedRotation = true;
      this.sprite.body.setCollisionGroup(this.group);
    },
    update: function() {
    },
  });
  return Player;
});
