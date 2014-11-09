define(['phaser', 'juicy', 'tunnel'], function(__phaser, __Juicy, Tunnel) {
  return {
    start: function() {
      var game = new Phaser.Game(880, 440, Phaser.AUTO, 'container', null, false, true, null);

      window.game = game;
      game.state.add('Boot', {
        preload: function() {
           console.log('Loading!');
           game.load.audio('sfx-liquid', ['data/sfx-liquid.wav']);
           game.load.audio('sfx-solid', ['data/sfx-solid.wav']);
           game.load.audio('sfx-gaz', ['data/sfx-gaz.wav']);
           //game.load.image('player', 'data/shinyball.png');
           game.load.spritesheet('back', 'data/fond.png', 1, 440, 3);
           game.load.spritesheet('player', 'data/liquid-solid.png', 230, 300, 10*3);
           game.load.spritesheet('wall', 'data/wall.png', 77, 440, 2 * 3);
           game.load.spritesheet('vacuum', 'data/vacuum.png', 65, 440, 2 * 3);
           game.load.spritesheet('grid', 'data/grid.png', 40, 440, 2 * 3);
           game.load.spritesheet('hole', 'data/hole.png', 163, 440, 3);
           //game.load.spritesheet('spikes', 'data/spikes.png', 163, 440, 3);
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
        },
        render: function() {
          game.debug.body(this.tunnel.player);
          this.tunnel.obstaclesGroup.forEachAlive(function(me) {
            game.debug.body(me);
          }, this);
          this.tunnel.coinsGroup.forEachAlive(function(me) {
            game.debug.body(me);
          }, this);
        }
      });

      game.state.start('Boot');
    },
  };
});
