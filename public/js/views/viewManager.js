define([
    'backbone',
    'tmpl/manager'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({
        template: tmpl,
        tagName: 'div',
        id: 'managerview',
        views: [],
        initialize: function () {
            document.getElementsByTagName('body')[0].appendChild(this.el);
        },

        registerViews: function(actualViews) {
            for (var i = 0; i < actualViews.length; i++) {
                this.views.push(actualViews[i]);
                this.listenTo(actualViews[i], 'show', this.rebuildPage);
                this.el.appendChild(actualViews[i].el);
                actualViews[i].render();
            }
        },

        rebuildPage: function(sender) {
            for (var i = 0; i < this.views.length; i++) {
                if (sender !== this.views[i]) {
                    this.views[i].hide();
                }
            }
        }
    });
    
    return new View();
});