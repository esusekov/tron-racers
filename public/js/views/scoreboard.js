define([
    'backbone',
    'tmpl/scoreboard',
    'views/scoretable'
], function(
    Backbone,
    tmpl,
    scoretable
){
    var View = Backbone.View.extend({
        template: tmpl,
        tagName: 'div',
        id: 'scoreboardview',
        className: 'window',
        /*initialize: function () {
            document.getElementsByTagName('body')[0].appendChild(this.el);
            this.render();
        },*/
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function () {
            var scoreboard = this;
            $('#refreshTable').click(function () {scoreboard.show()});
            this.trigger('show', this);
            $('#error').hide();
            $('#loading').show();
            this.get();
            this.el.style.display = "";
        },
        hide: function () {
            scoretable.hide();
            this.el.style.display = "none";
        },
        get: function () {
            var scoreboard = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/scores', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        scoreboard.updateFromLocal();
                        scoreboard.fetchScoretable();
                    } else scoreboard.fetchScoretable();
                }
            };
            xhr.send(null);
            
        },
        fetchScoretable: function() {
            scoretable.players.fetch({
                success: function(collection, response, options) {
                    $('#loading').hide();
                    scoretable.show();
                },
                error: function(collection, response, options) {
                    $('#loading').hide();
                    $('#error').show();
                }
            });
        },
        updateFromLocal: function() {
            var localStorageLength = localStorage.length;
            if (localStorageLength > 0) {
                for (var i = 0; i < localStorageLength; i++) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/scores', true);
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    var localModel = JSON.parse(localStorage[i]);
                    xhr.send('name='+localModel.name+'&score='+localModel.score);
                    delete localStorage[i];
                }
            }
        }
    });

    return new View();
});