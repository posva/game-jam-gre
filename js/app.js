define(['phaser'], function(__phaser) {
  return {
    start: function() {
      var game = new Phaser.Game(640, 480, Phaser.AUTO, 'container', null, false, true, null);

      //game.state.add('Boot', Boot);
      //game.state.start('Boot');
    },
  };
});
