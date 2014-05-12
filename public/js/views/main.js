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