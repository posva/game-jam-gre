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
    grid: [21, 440, 9, 0],
    wall: [
      [65, 160, 6, 231],
      [65, 153, 6, 77],
    ],
    vacuum: [
      [65, 100, 0, 320],
      [65, 100, 0, 20],
    ],
    hole: [200, 100, 16, 320],
    spikes: [10, 50, 0, 0],
    ice: [10, 50, 0, 0],
  };

  var hl = ['wall', 'vacuum'];
  _.forOwn(obstacle, function(v, k) {
    obstacle[k] = function(game, tunnel) {
      var x = game.world.width + tunnel.velocity;
      var y, frame, pos;
      if (hl.indexOf(k) > -1) {
        pos = Math.floor(Math.random()*2);
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
      if (hl.indexOf(k) > -1) {
        obs.body.setSize.apply(obs.body, masks[k][pos]);
      } else {
        obs.body.setSize.apply(obs.body, masks[k]);
      }
      var realObs = obs;
      if (k === 'grid') {
        obs = tunnel.obstaclesGroup.create(x, 0, k, frame+1);
        obs.type = k;
        obs.body.velocity.x = -tunnel.velocity;
      }
      return obs;
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
