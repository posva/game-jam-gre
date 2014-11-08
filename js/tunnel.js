define(['phaser', 'selfish', 'lodash', 'player'], function(__phaser, selfish, _, Player) {
  var Base = selfish.Base;
  function destroySelf() {
    if (this.x >= game.world.width) {
      return;
    }
    console.log('destroyed');
    this.kill();
  }
  function collisionHandler(player, obstacle) {
    this.state = 'stop';
    obstacle.kill();
  }
  var Tunnel = Base.extend({
    initialize: function(game) {
      this.state = 'move';
      this.velocity = 200;

      this.playerState = 0;
      this.playerStates = ['liquid', 'solid', 'gaz'];
      this.playerTween = {};
      this.playerPos = {
        liquid: 400,
        solid:  250,
        gaz: 100
      };
      // liquid, solid, gaz

       this.playerGroup = game.add.group();
       this.playerGroup.enableBody = true;
       this.playerGroup.physicsBodyType = Phaser.Physics.ARCADE;
       this.player = this.playerGroup.create(96, this.playerPos.liquid, 'player');
       this.player.body.collideWorldBounds = true;

       this.obstaclesGroup = game.add.group();
       this.obstaclesGroup.enableBody = true;
       this.obstaclesGroup.physicsBodyType = Phaser.Physics.ARCADE;

       this.cursors = game.input.keyboard.createCursorKeys();

       var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
       up.onDown.add(this.movePlayer.bind(this, game, true));
       var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
       down.onDown.add(this.movePlayer.bind(this, game, false));

       game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
       this.i = 0;
       //game.world.setBounds(0, 33, game.world.width, game.world.height-33*2);
    },
    createObstacle: function(game) {
      var obs = this.obstaclesGroup.create(300+ this.velocity, this.player.y, 'player');
      obs.checkWorldBounds = true;
      obs.events.onOutOfBounds.addOnce(destroySelf, obs);
      obs.body.velocity.x = -this.velocity;
    },
    movePlayer: function(game, up) {
      if (this.playerTween.isRunning || (up && this.playerState === 2) || (!up && this.playerState === 0)) {
        return;
      }
      this.playerState += up ? 1 : -1;
      this.playerTween = game.add.tween(this.player).
        to({y: this.playerPos[this.playerStates[this.playerState]]}, 300,
           Phaser.Easing.Cubic.Out).start();
    },
    update: function(game) {
       game.physics.arcade.overlap(this.playerGroup, this.obstaclesGroup, collisionHandler, null, this);
       this.velocity += 0.25;

      //this.game.physics.ninja.collide(this.player.sprite, this.tiles);
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.createObstacle(game);
      }
    },
  });
  return Tunnel;
});
