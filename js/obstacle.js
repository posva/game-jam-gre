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
  var hl = ['wall', 'vacuum'];
  _.forOwn(obstacle, function(v, k) {
    obstacle[k] = function(game, tunnel) {
      var x = game.world.width + tunnel.velocity;
      var y;
      if (hl.indexOf(k) > -1) {
        y = tunnel.positions[k][Math.floor(Math.random()*2)];
      } else {
        y = tunnel.positions[k];
      }
      var obs = tunnel.obstaclesGroup.create(x, y, k);
      obs.type = k;
      obs.body.velocity.x = -tunnel.velocity;
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
