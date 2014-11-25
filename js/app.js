define(['phaser', 'juicy', 'tunnel', 'lodash'], function(__phaser, __Juicy, Tunnel, _) {
  return {
    start: function() {
      var game = new Phaser.Game(880, 440, Phaser.AUTO, 'container', null, false, true, null);

      window.game = game;
      game.state.add('Boot', {
        preload: function() {
           var loadingSpan = document.getElementById('loading');
           game.load.onFileComplete.add(function(perc) {
             loadingSpan.textContent = perc+'%';
             if (perc === 100) {
               document.getElementById('menu').style.opacity = 0;
             }
           });

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
             'coin': 'data/img/coin.png',
             'part': 'data/img/gaz-particule.png',
             'back': {
               url: 'data/img/fond.png',
               frameWidth: 1,
               frameHeight: 440,
               frameMax: 3,
             },
             'player': {
               url: 'data/img/liquid-solid.png',
               frameWidth: 230,
               frameHeight: 300,
               frameMax: 10*3,
             },
             'wall': {
               url: 'data/img/wall.png',
               frameWidth: 77,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'vacuum': {
               url: 'data/img/vacuum.png',
               frameWidth: 65,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'grid': {
               url: 'data/img/grid.png',
               frameWidth: 40,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'ice': {
               url: 'data/img/ice.png',
               frameWidth: 298,
               frameHeight: 440,
               frameMax: 2 * 3
             },
             'hole': {
               url: 'data/img/hole.png',
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
             loader.apply(game.load, v);
           });

           game.juicy = game.plugins.add(new Phaser.Plugin.Juicy(game));
        },
        create: function() {
          this.tunnel = Tunnel.new(game);
          window.tunnel = this.tunnel;
          //this.debug = true;
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
