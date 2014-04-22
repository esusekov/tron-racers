define([
    'backbone',
    'tmpl/gameOver'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({
        
        template: tmpl,
        tagName: 'div',
        id: 'gameOverview',
        className: 'window',
        /*initialize: function () {
            document.getElementsByTagName('body')[0].appendChild(this.el);
            this.render();
        },*/
        events: {
            "click #save": "post",
            "keypress": function (e) {
                if (e.which === 13) {
                    this.post();
                }
            }
        },
        render: function () {
            this.$el.html(this.template());
            //$('#save').click( function() {gameOver.post()});
            return this;
        },
        show: function () {
            this.el.style.display = "";
            this.trigger('show', this);
        },
        hide: function () {
            this.el.style.display = "none";
        },
        post: function () {
            
            var nick = $('input[name=Nickname]');
            var saveBtn = $('#save');
            var dontsaveBtn = $('#dontsave');
            var newScore = $('#newScore').html();
            nick.prop("disabled", true);
            saveBtn.prop("disabled", true); 
            dontsaveBtn.prop("disabled", true); 
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/scores', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        nick.val(null);
                        nick.css({"border-color": "#9E9E9E"});
                        nick.prop("disabled", false);
                        saveBtn.prop("disabled", false);
                        dontsaveBtn.prop("disabled", false);
                        window.location.replace("#scoreboard"); 
                    }
                    if(xhr.status == 400) {
                        nick.val(null);
                        nick.prop("disabled", false);
                        saveBtn.prop("disabled", false);
                        dontsaveBtn.prop("disabled", false);
                        nick.css({"border-color": "red"});
                    }
                    if(xhr.status >= 500) {
                        var local = {
                            name: nick.val(),
                            score: newScore
                        }
                        localStorage[localStorage.length] = JSON.stringify(local);
                        nick.val(null);
                        nick.css({"border-color": "#9E9E9E"});
                        nick.prop("disabled", false);
                        saveBtn.prop("disabled", false);
                        dontsaveBtn.prop("disabled", false);
                        window.location.replace("#scoreboard");
                    }
                }
            };
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send('name='+nick.val()+'&score='+newScore);
        }
    });

    return new View();
});