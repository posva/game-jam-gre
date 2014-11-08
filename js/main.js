requirejs(['ready', 'app'], function(dom, app) {
  dom(function() {
    console.log('Started');
    app.start();
  });
});
