define([
    'backbone',
    'tmpl/scoretable',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    collectionOfPlayers
){
    var View = Backbone.View.extend({
        template: tmpl,
        tagName: 'div',
        id: 'scoretableview',
        //className: 'scoretable',
        players: collectionOfPlayers,
        /*initialize: function () {
            document.getElementById('scoretable').appendChild(this.el);
            this.render();
        },*/
        render: function () {
            //this.players.fetch();
            document.getElementById('scoretable').appendChild(this.el);
            this.$el.html(this.template(this.players.toJSON()));
            return this;
        },
        show: function () {
            //this.trigger('show', this);
            this.render();
            this.el.style.display = "";
        },
        hide: function () {
            this.el.style.display = "none";
        }

    });

    return new View();
});