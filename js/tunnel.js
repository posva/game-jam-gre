define(['phaser', 'selfish', 'lodash', 'player', 'deadMessage', 'obstacle'], function(__phaser, selfish, _, Player, DeadMessage, obstacles) {
  var Base = selfish.Base;
  function destroySelf(me) {
    console.log(me);
    if (me.x < 0) {
      console.log('destroyed');
      this.kill();
    }
  }
  function collisionHandler(player, obs) {
    if (!obstacles.pass[obs.type][this.playerStates[this.playerState]]) {
      this.state = 'dead';
      player.kill();
      this.obstaclesGroup.forEachAlive(function(me) {
        me.body.velocity = 0;
      });
      this.deadMessage.show(this.game);
    }
  }
  var Tunnel = Base.extend({
    initialize: function(game) {
      this.state = 'run';
      this.velocity = 200;
      this.difficultyRange = 0;
      this.difficulty = 0;
      this.score = 0;
      this.game = game;

      this.deadMessage = new DeadMessage(game, this);

      this.positions = {
        grid: game.world.height / 2,
        spikes: game.world.height / 2,
        ice: game.world.height / 2,
        hole: game.world.height / 2,
        wall: [50, 150],
        vacuum: [50, 150],
      };

      this.danger = [
        2.2 * 60,
        1.0 * 60,
        0.7 * 60,
      ];

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
       this.player.anchor.set(0.5, 0.5);
       this.player.body.collideWorldBounds = true;
       this.player.animations.add('liquid-solid', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
       this.player.animations.add('solid-liquid', [0, 1, 2, 3, 4, 5, 6, 7, 8].reverse());
       this.framesToObstacle = 0;

       this.smokeEmitter = game.add.emitter(this.player.x, this.player.y);
       this.smokeEmitter.setAlpha(1, 0, 500);
       this.smokeEmitter.makeParticles('player');
       this.smokeEmitter.setScale(0.5, 1, 0.5, 1, 500);
       this.smokeEmitter.maxParticles = 1000;
       this.smokeEmitter.start(false, 500, 1, 5);
       this.smokeEmitter.on = false;

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
    replay: function() {
      this.state = 'run';
      this.start({
        level: this.currentLevel,
      });
    },
    start: function(conf) {
      if (this.state === 'menu') {
      } else if (this.state === 'run') {
        this.obstaclesGroup.removeAll();
        this.framesToObstacle = this.danger[conf.level];
        this.score = 0;
        this.difficultyRange = conf.level;
        this.difficulty = 0;
        this.velocity = conf.level * 1.65;
      } else if (this.state === 'dead') {
      }
    },
    createObstacles: function(game) {
      var tab;
      if (this.difficultyRange === 0) {
        tab = [
          'grid', 'grid', 'grid', 'grid',
          'wall', 'wall', 'wall',
          'ice',
          'spikes',
          'hole', 'hole', 'hole',
          'vacuum', 'vacuum', 'vacuum',
        ];
        wh = tab[Math.floor(Math.random() * tab.length)];
        var obs = obstacles[wh](game, this);
      }
    },
    movePlayer: function(game, up) {
      if (this.state !== 'run' || this.playerTween.isRunning || (up && this.playerState === 2) || (!up && this.playerState === 0)) {
        return;
      }
      var oldState = this.playerStates[this.playerState];
      this.playerState += up ? 1 : -1;
      var newState = this.playerStates[this.playerState];
      this.player.play(oldState+'-'+newState, 22.22);
      this.playerTween = game.add.tween(this.player).
        to({y: this.playerPos[this.playerStates[this.playerState]]}, 300,
           Phaser.Easing.Cubic.Out).start();
           game.juicy.jelly(this.player, 0.45);
    },
    update: function(game) {
      this.obstaclesGroup.forEachAlive(function(obs) {
        if (obs.x < - (obs.width / 2 + 20)) {
          console.log('killed');
          this.score++;
          obs.kill();
        }
      }, this);
      if (this.playerState === 2 || (this.playerState === 1 && this.playerTween.isRunning && this.player.y < this.playerPos.solid)) {
        this.smokeEmitter.x = this.player.x;
        this.smokeEmitter.y = this.player.y;
        this.smokeEmitter.area.setTo(this.player.x - this.player.body.width,
                                     this.player.y - this.player.body.height,
                                     this.player.body.width,
                                     this.player.body.height
                                    );
        //this.smokeEmitter.start(true, 500, null, 5, true);
        if (!this.smokeEmitter.on) {
          this.smokeEmitter.on = true;
        } else {
          this.smokeEmitter.on = false;
        }
      }
      if (this.state === 'run') {
        this.framesToObstacle--;
        if (this.framesToObstacle <= 0) {
          this.framesToObstacle = this.danger[this.difficultyRange] - this.difficulty / 200;
          this.createObstacles(game);
        }
         game.physics.arcade.overlap(this.playerGroup, this.obstaclesGroup, collisionHandler, null, this);
         this.velocity += 0.25;
         this.difficulty++;
      } else if (this.state === 'dying') {
      } else if (this.state === 'dead') {
      }

      //this.game.physics.ninja.collide(this.player.sprite, this.tiles);
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.createObstacles(game);
      }
    },
  });
  return Tunnel;
});
