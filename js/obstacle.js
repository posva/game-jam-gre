define(['phaser', 'selfish', 'lodash'], function(__phaser, selfish, _) {
  var Base = selfish.Base;
  var obstacle = {
    grid: null,
    wall: null,
    vacuum: null,
    hole: null,
    spikes: null,
    ice: null,
  };
  var  masks = {
    grid: [100, 100, 0, 0],
    wall: [
      [10, 50, 0, 0],
      [10, 50, 0, 0],
    ],
    vacuum: [
      [10, 50, 0, 0],
      [10, 50, 0, 0],
    ],
    hole: [10, 50, 0, 0],
    spikes: [10, 50, 0, 0],
    ice: [10, 50, 0, 0],
  };

  var hl = ['wall', 'vacuum'];
  _.forOwn(obstacle, function(v, k) {
    obstacle[k] = function(game, tunnel) {
      var x = game.world.width + tunnel.velocity;
      var y, frame;
      if (hl.indexOf(k) > -1) {
        var pos = Math.floor(Math.random()*2);
        y = tunnel.positions[k][pos];
        frame = 0 + pos;
      } else {
        y = tunnel.positions[k];
        frame = 0;
      }
      var obs;
      obs = tunnel.obstaclesGroup.create(x, 0, k, frame);
      obs.type = k;
      obs.body.velocity.x = -tunnel.velocity;
      // XXX call me
      //obs.body.setSize.apply(obs.body, masks[k]);
      if (k === 'grid') {
        obs = tunnel.obstaclesGroup.create(x, 0, k, frame+1);
        obs.type = k;
        obs.body.velocity.x = -tunnel.velocity;
      }
    };
  });

  obstacle.pass = {
    grid: {},
    wall: {},
    vacuum: {},
    hole: {},
    spikes: {},
    ice: {},
  };
  var solid = [
    'ice',
    'vacuum'
  ];
  var liquid = [
    'grid',
    'spikes',
  ];
  var gaz = [
    'grid',
    'hole',
    'spikes',
  ];

  _.forOwn(obstacle.pass, function(v, k) {
    obstacle.pass[k].solid = (solid.indexOf(k) > -1);
    obstacle.pass[k].liquid = (liquid.indexOf(k) > -1);
    obstacle.pass[k].gaz = (gaz.indexOf(k) > -1);
  });

  return obstacle;
});
