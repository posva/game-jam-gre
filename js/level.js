define(['phaser', 'selfish', 'lodash', 'player'], function(__phaser, selfish, _, Player) {
  var Base = selfish.Base;
  var Level = Base.extend({
    initialize: function(game, level) {
      this.cache = null;
      this.layer = null;
      this.data = null;
      this.width = null;
      this.height = null;
      this.tiles = null;
      //this.game = game;
      this.player = null;
      this.name = level;
      game.levels = game.levels || {};
      game.levels[this.name] = this;
      window.game = game;
    },
    create: function(game) {
      this.level = game.levels[game.currentState];
      this.level.cache = game.cache.getJSON(this.level.name);
      this.level.layer = this.level.cache.layers[0];
      this.level.data = this.level.layer.data;
      this.level.width = this.level.layer.width;
      this.level.height = this.level.layer.height;
      this.level.tiles = game.add.group();

      //game.world.setBounds(0, 0, 640, 480);
      //game.world.setBounds(0, 0, this.level.width * 32, this.level.height * 32);
      game.physics.p2.restitution = 0.8;
      game.physics.p2.updateBoundsCollisionGroup();
      game.physics.p2.setBounds(0, 0, 640, 480);
      game.physics.p2.setImpactEvents(true);

      var pandaCollisionGroup = game.physics.p2.createCollisionGroup();

      this.level.player = Player.new(game);

      var tile;
      var i = 0;
      for (var y = 0; y < this.level.height; y++) {
        for (var x = 0; x < this.level.width; x++) {
          if (this.level.data[i] > 0) {
              //tile = this.level.tiles.create(x * 64, y * 64, this.level.name+'-tiles', this.level.data[i] - 1);
              tile = this.level.tiles.create(x * 64, y * 64, 'ninja-tiles', this.level.data[i] - 1);
              //game.physics.ninja.enableTile(tile, tile.frame);
            }
            i++;
        }
      }
      game.camera.follow(this.level.player.sprite);

      var pandas = game.add.group();
      window.pandas = pandas;
      pandas.enableBody = true;
      pandas.physicsBodyType = Phaser.Physics.P2JS;

      for (i = 0; i < 4; i++) {
        var panda = pandas.create(game.world.randomX, game.world.randomY, 'player');
        panda.body.setRectangle(40, 40);

        //  Tell the panda to use the pandaCollisionGroup 
        panda.body.setCollisionGroup(pandaCollisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        panda.body.collides([pandaCollisionGroup, this.level.player.group]);
      }
      this.level.player.sprite.body.collides(pandaCollisionGroup, function() {console.log('lol');}, this);
    },
    update: function() {
      //this.game.physics.ninja.collide(this.player.sprite, this.tiles);
    },
  });
  return Level;
});
