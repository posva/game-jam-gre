define(['phaser', 'juicy', 'tunnel'], function(__phaser, __Juicy, Tunnel) {
  return {
    start: function() {
      var game = new Phaser.Game(880, 440, Phaser.AUTO, 'container', null, false, true, null);

      window.game = game;
      game.state.add('Boot', {
        preload: function() {
           console.log('Loading!');
           game.load.spritesheet('ninja-tiles', 'data/ninja-tiles32.png', 32, 32, 34);
           //game.load.image('player', 'data/shinyball.png');
           game.load.spritesheet('player', 'data/liquid-solid.png', 70.5, 84, 9, 1, 2.2);
           game.juicy = game.plugins.add(new Phaser.Plugin.Juicy(game));
           console.log('Loaded!');
        },
        create: function() {
          //game.physics.startSystem(Phaser.Physics.NINJA);
          //game.physics.startSystem(Phaser.Physics.P2JS);
          this.tunnel = Tunnel.new(game);
        },
        update: function() {
          game.juicy.update();
          this.tunnel.update(this);
        }
      });

      game.state.start('Boot');
    },
  };
});
