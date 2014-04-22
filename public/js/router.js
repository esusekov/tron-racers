define([
    'backbone',
    'views/main',
    'views/game',
    'views/scoreboard',
    'views/viewManager',
    'views/gameOver'
], function(
    Backbone,
    mainView,
    gameView,
    scoreboardView,
    viewManager,
    gameOverView
){
    viewManager.registerViews([mainView, gameView, scoreboardView, gameOverView]);

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
            mainView.show();
        },
        scoreboardAction: function () {
            scoreboardView.show();
        },
        gameAction: function () {
            gameView.show();
        }
    });

    return new Router();
});