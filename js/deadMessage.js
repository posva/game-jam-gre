define(['phaser', 'lodash'], function(__phaser, _) {
  var DeadMessage = function(game, tunnel) {
    this.positons = {
      out: -300,
      show: game.world.height / 2
    };
    this.offsets = {
      box: 0,
      button: 100,
      score: 48,
    };
    this.box = game.add.sprite(game.world.width / 2, -300, 'msgBox');
    this.button = game.add.button(game.world.width / 2, -200, 'button', tunnel.replay, tunnel, 2, 1, 0);

    this.score = game.add.text(game.world.width / 2, this.positons.out + this.offsets.score, '123328278366127');
    this.score.align = 'center';
    this.score.anchor.set(0.5);
    this.score.font = 'Arial Black';
    this.score.fontSize = 50;
    this.score.fontWeight = 'bold';
    this.score.stroke = '#000000';
    this.score.strokeThickness = 6;
    this.score.fill = '#fff';

    this.elements = {
      box: this.box,
      button: this.button,
      score: this.score,
    };

    _.forOwn(this.elements, function(v) {
      this.z = 1000;
    }, this);
  };

  DeadMessage.prototype.show = function(game) {
    _.forOwn(this.elements, function(v,k) {
      game.add.tween(v).to({y: this.positons.show + this.offsets[k]}, 500, Phaser.Easing.Elastic.Out).start();
      game.juicy.jelly(v, 0.45);
      game.world.bringToTop(v);
    }, this);
  };

  DeadMessage.prototype.hide = function(game) {
    _.forOwn(this.elements, function(v,k) {
      game.add.tween(v).to({y: this.positons.out + this.offsets[k]}, 500, Phaser.Easing.Elastic.Out).start();
      game.juicy.jelly(v, 0.45);
    }, this);
  };

  return DeadMessage;
});
