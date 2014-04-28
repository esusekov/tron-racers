define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){
    
    var View = Backbone.View.extend({
        
        template: tmpl,
        tagName: 'div',
        id: 'mainview',
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
            this.el.style.display = "";
            this.trigger('show', this);
        },
        hide: function () {
            this.el.style.display = "none";
        }

    });

    return new View();
});