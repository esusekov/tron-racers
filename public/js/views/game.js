define([
    'backbone',
    'tmpl/game'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({
        template: tmpl,
        tagName: 'div',
        id: 'gameview',
        className: 'window',
        /*initialize: function () {
            document.getElementsByTagName('body')[0].appendChild(this.el);
            this.render();
        },*/
        render: function () {
            this.$el.html(this.template());
            this.$el.keyup(this.keyPressHandlers);
            return this;
        },
        show: function () {
            this.el.style.display = "";
            var game = this;
            $('#dontsave').click(function(){
                var nick = $('#nickname');
                nick.val(null);
                nick.css({"border-color": "#9E9E9E"});
                game.show()});
            this.trigger('show', this);
        },
        hide: function () {
            this.el.style.display = "none";
            
        }
    });

    return new View();
});