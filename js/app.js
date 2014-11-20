define(['phaser', 'juicy', 'tunnel', 'lodash'], function(__phaser, __Juicy, Tunnel, _) {
  return {
    start: function() {
      var game = new Phaser.Game(880, 440, Phaser.AUTO, 'container', null, false, true, null);

      window.game = game;
      game.state.add('Boot', {
        preload: function() {
           console.log('Loading!');
           var rw = 300, rh = 44;
           var loadBack = game.add.graphics(game.width/2 - rw/2, game.height/2 - rh/2);
           //loadBack.drawTriangles([
             //new
           //]);

           var files = {
             'sfx-liquid': [
               'data/sfx/sfx-liquid.ogg',
               'data/sfx/sfx-liquid.mp3',
               'data/sfx/sfx-liquid.wav'
             ],
             'sfx-solid': [
               'data/sfx/sfx-solid.ogg',
               'data/sfx/sfx-solid.mp3',
               'data/sfx/sfx-solid.wav'
             ],
             'sfx-gaz': [
               'data/sfx/sfx-gaz.ogg',
               'data/sfx/sfx-gaz.mp3',
               'data/sfx/sfx-gaz.wav'
             ],
             'music-cuivre': [
               'data/music/mu_hydrogen_level_1.ogg',
               'data/music/mu_hydrogen_level_1.mp3',
               'data/music/mu_hydrogen_level_1.wav'
             ],
             'coin': 'data/coin.png',
             'part': 'data/cuivre-gaz-particule.png',
             'back': {
               url: 'data/fond.png',
               frameWidth: 1,
               frameHeight: 440,
               frameMax: 3,
             },
             'player': {
               url: 'data/liquid-solid.png',
               frameWidth: 230,
               frameHeight: 300,
               frameMax: 10*3,
             },
             'wall': {
               url: 'data/wall.png',
               frameWidth: 77,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'vacuum': {
               url: 'data/vacuum.png',
               frameWidth: 65,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'grid': {
               url: 'data/grid.png',
               frameWidth: 40,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'ice': {
               url: 'data/ice.png',
               frameWidth: 298,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'hole': {
               url: 'data/hole.png',
               frameWidth: 263,
               frameHeight: 440,
               frameMax: 3
             },
           };
           _.forOwn(files, function(v, k) {
             var loader;
             if (typeof v === 'string') {
               loader = game.load.image;
               v = [k, v];
             } else if (typeof v === 'object' && typeof v.length === 'number') {
               loader = game.load.audio;
               v = [k, v];
             } else if (typeof v === 'object' && typeof v.length === 'undefined') {
               loader = game.load.spritesheet;
               v.frameMax = v.frameMax || -1;
               v.margin = v.margin || 0;
               v.spacing = v.spacing || 0;

               v = [k, v.url, v.frameWidth, v.frameHeight, v.frameMax, v.margin, v.spacing];
             }
             console.log('Loading '+k);
             loader.apply(game.load, v);
           });
           //game.load.audio('sfx-liquid', ['data/sfx-liquid.wav']);
           //console.log(1);
           //game.load.audio('sfx-solid', ['data/sfx/sfx-solid.wav']);
           //console.log(2);
           //game.load.audio('sfx-gaz', ['data/sfx/sfx-gaz.wav']);
           //console.log(3);
           //game.load.audio('music-cuivre', ['data/music/mu_hydrogen_level_1.wav']);
           //console.log(4);
           //game.load.image('coin', 'data/coin.png');
           //game.load.image('part', 'data/cuivre-gaz-particule.png');
           //game.load.spritesheet('back', 'data/fond.png', 1, 440, 3);
           //game.load.spritesheet('player', 'data/liquid-solid.png', 230, 300, 10*3);
           //game.load.spritesheet('wall', 'data/wall.png', 77, 440, 2 * 3);
           //game.load.spritesheet('vacuum', 'data/vacuum.png', 65, 440, 2 * 3);
           //game.load.spritesheet('grid', 'data/grid.png', 40, 440, 2 * 3);
           //game.load.spritesheet('ice', 'data/ice.png', 298, 440, 2 * 3);
           //game.load.spritesheet('hole', 'data/hole.png', 263, 440, 3);
           //game.load.spritesheet('spikes', 'data/spikes.png', 163, 440, 3);
           //game.load.spritesheet('ice-part', 'data/ice-part.png', 40, 137, 5);
           game.juicy = game.plugins.add(new Phaser.Plugin.Juicy(game));
           console.log('Loaded!');
        },
        create: function() {
          //game.physics.startSystem(Phaser.Physics.NINJA);
          //game.physics.startSystem(Phaser.Physics.P2JS);
          this.tunnel = Tunnel.new(game);
          this.debug = true;
        },
        update: function() {
          game.juicy.update();
          this.tunnel.update(this);
        },
        render: function() {
          if (this.debug) {
            game.debug.body(this.tunnel.player);
            this.tunnel.obstaclesGroup.forEachAlive(function(me) {
              game.debug.body(me);
            }, this);
            this.tunnel.coinsGroup.forEachAlive(function(me) {
              game.debug.body(me);
            }, this);
          }
        }
      });

      game.state.start('Boot');
    },
  };
});
