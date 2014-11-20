requirejs(['ready', 'app'], function(dom, app) {
  dom(function() {
    console.log('Started');
    document.getElementById('menu').style.opacity = 0;
    app.start();
  });
});
