requirejs.config({
  baseUrl: 'js',
  nodeRequire: require,
  paths: {
    ready: '../node_modules/domready/ready.min',
    selfish: '../node_modules/selfish/selfish',
    lodash: '../node_modules/lodash/lodash',
    requireLib: '../node_modules/requirejs/require',
    phaser: '../node_modules/phaser/build/phaser.min',
    juicy: '../plugins/Juicy',
  },
  shim: {
    'juicy': {
      deps: ['phaser'],
      //exports: 'Juicy'
    },
  }
});
